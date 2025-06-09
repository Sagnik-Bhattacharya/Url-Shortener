import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Url from "@/models/link.model";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const {shortUrl} = params;
    const url = await Url.findOneAndUpdate({shortUrl:shortUrl},{$inc:{clicks:1}});
    if(url){
        return NextResponse.redirect(url.originalUrl);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
}
