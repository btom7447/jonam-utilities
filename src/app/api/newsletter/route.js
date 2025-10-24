import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Newsletter.find(); // fetch all subscribers
    return NextResponse.json(subscribers, { status: 200 });
  } catch (error) {
    console.error("GET /newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    if (!data.email_address) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const existing = await Newsletter.findOne({
      email_address: data.email_address,
    });
    if (existing) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 400 }
      );
    }

    const newSubscriber = await Newsletter.create(data);
    return NextResponse.json(newSubscriber, { status: 201 });
  } catch (error) {
    console.error("POST /newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
