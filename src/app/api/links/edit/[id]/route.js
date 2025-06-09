// app/api/links/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import Url from '@/models/link.model';
import { generateQRCode } from '@/lib/generateQR';

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { originalUrl, shortUrl, expiresAt } = await req.json();

    if (!originalUrl || !shortUrl) {
      return NextResponse.json(
        { error: 'originalUrl and shortUrl are required' },
        { status: 400 }
      );
    }

    const url = await Url.findById(id);
    if (!url) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    // Optional: Check if the new shortUrl is unique (and not the same URL)
    if (url.shortUrl !== shortUrl) {
      const exists = await Url.findOne({ shortUrl });
      if (exists) {
        return NextResponse.json(
          { error: 'Short URL already in use' },
          { status: 409 }
        );
      }
    }

    url.originalUrl = originalUrl;
    url.shortUrl = shortUrl;
    url.expiresAt = expiresAt ? new Date(expiresAt) : undefined;

    // Regenerate QR
    const qrCode = await generateQRCode(originalUrl, id);
    url.qrCode = qrCode;

    await url.save();

    return NextResponse.json(url);
  } catch (error) {
    console.error('[PUT /api/links/:id]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
