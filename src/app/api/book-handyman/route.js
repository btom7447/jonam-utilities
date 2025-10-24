import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

// ✅ GET all bookings
export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find()
      .populate("handyman")
      .sort({ createdAt: -1 });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// ✅ CREATE booking
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const booking = await Booking.create(body);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
