import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Handyman from "@/models/Handyman";

export async function GET() {
  try {
    await connectDB();
    const handymen = await Handyman.find();
    return NextResponse.json(handymen);
  } catch (error) {
    console.error("GET /handyman error:", error);
    return NextResponse.json(
      { error: "Failed to fetch handymen" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const handyman = await Handyman.create(body);
    return NextResponse.json(handyman, { status: 201 });
  } catch (error) {
    console.error("POST /handyman error:", error);
    return NextResponse.json(
      { error: "Failed to create handyman" },
      { status: 500 }
    );
  }
}
