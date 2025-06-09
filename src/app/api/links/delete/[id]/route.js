import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Url from "@/models/link.model";

export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const { id } = params;
        await Url.findByIdAndDelete(id);
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}