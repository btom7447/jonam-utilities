import { NextResponse } from "next/server";
import { requestQuote } from "@/lib/airtable";

export async function POST(req) {
    const body = await req.json();
    const result = await requestQuote(body);

    if (result.success) {
        return NextResponse.json({ message: "Request Quote created", id: result.id }, { status: 201 });
    } else {
        return NextResponse.json({ message: "Request Quote failed", error: result.error }, { status: 500 });
    }
}
