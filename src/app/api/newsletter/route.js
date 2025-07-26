import { NextResponse } from "next/server";
import { newsletter } from "@/lib/airtable";

export async function POST(req) {
    const body = await req.json();
    const result = await newsletter(body);

    if (result.success) {
        return NextResponse.json({ message: "Newsletter request created", id: result.id }, { status: 201 });
    } else {
        return NextResponse.json({ message: "Newsletter request failed", error: result.error }, { status: 500 });
    }
}
