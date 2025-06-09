// app/api/links/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Url from "@/models/link.model";
import { nanoid } from "nanoid";
import { fetchUser } from "@/lib/auth";
import User from "@/models/user.model";
import { generateQRCode } from "@/lib/generateQR";

export async function POST(req) {
  try {
    await connectDB();
    const { originalUrl, expiresAt } = await req.json();

    if (!originalUrl) {
      return NextResponse.json(
        { error: "originalUrl is required" },
        { status: 400 }
      );
    }

    const user = await fetchUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userFinal = await User.findById(user._id).select("-password");
    console.log(userFinal);

    // Generate a unique shortUrl using nanoid
    let shortUrl;
    let exists;
    do {
      shortUrl = nanoid(8); // 8-char unique id, adjust length as needed
      exists = await Url.findOne({ shortUrl });
    } while (exists);

    // 1. Create newUrl (but DO NOT save yet)
    const newUrl = new Url({
      originalUrl,
      shortUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    // 2. Save to get _id (required for QR update)
    await newUrl.save();

    // 3. Add reference to user
    userFinal.urls.push(newUrl._id);
    await userFinal.save();

    // 4. Generate QR and update document
    await generateQRCode(originalUrl, newUrl._id);

    // 5. Refetch updated version with qrCode included
    const finalUrl = await Url.findById(newUrl._id);

    return NextResponse.json(finalUrl, { status: 201 });
  } catch (error) {
    console.error("[POST /api/links]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
