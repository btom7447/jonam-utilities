import { NextResponse } from "next/server";
import { contactForm } from "@/lib/airtable";

export async function POST(req) {
    const body = await req.json();
    const result = await contactForm(body);

    if (result.success) {
        return NextResponse.json({ message: "Contact form created", id: result.id }, { status: 201 });
    } else {
        return NextResponse.json({ message: "Contact form failed", error: result.error }, { status: 500 });
    }
}
