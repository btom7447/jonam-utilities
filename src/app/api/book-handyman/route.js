import { NextResponse } from "next/server";
import { createBooking } from "@/lib/airtable";

export async function POST(req) {
    const body = await req.json();
    const result = await createBooking(body);

    if (result.success) {
        return NextResponse.json({ message: "Booking created", id: result.id }, { status: 201 });
    } else {
        return NextResponse.json({ message: "Booking failed", error: result.error }, { status: 500 });
    }
}
