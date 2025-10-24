import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import RequestQuote from "@/models/RequestQuote";

export async function GET() {
  try {
    await connectDB();
    const quotes = await RequestQuote.find().sort({ createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      full_name,
      phone_number,
      email_address,
      service_type,
      description,
    } = body;

    // 🔍 Validate required fields
    if (
      !full_name?.trim() ||
      !phone_number?.trim() ||
      !email_address?.trim() ||
      !service_type?.trim() ||
      !description?.trim()
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const newQuote = await RequestQuote.create({
      full_name,
      phone_number,
      email_address,
      service_type,
      description,
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    console.error("POST /api/request-quote error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
