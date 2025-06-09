// app/api/links/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import Url from '@/models/link.model';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const url = await Url.findById(id);
    if (!url) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    return NextResponse.json(url);
  } catch (error) {
    console.error('[GET /api/links/:id]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
