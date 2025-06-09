// app/api/links/me/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import { fetchUser } from '@/lib/auth';
import Url from '@/models/link.model';

export async function GET(req) {
  try {
    await connectDB();
    const user = await fetchUser(req); // includes populated `urls`

    return NextResponse.json(user.urls);
  } catch (err) {
    console.error('[GET /api/links/me]', err.message);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
