import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Url from "@/models/link.model";

export async function PUT(req, { params }) {
  const { id } = params;
  try {
    await connectDB();

    const urlDoc = await Url.findById(id);
    if (!urlDoc) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    urlDoc.clicks += 1;
    await urlDoc.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
