import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Logistics from "@/models/Logistics";

export async function GET() {
  try {
    await connectDB();
    const logistics = await Logistics.find().sort({ state: 1 });
    return NextResponse.json(logistics, { status: 200 });
  } catch (err) {
    console.error("Error fetching logistics:", err);
    return NextResponse.json(
      { error: "Failed to fetch logistics" },
      { status: 500 }
    );
  }
}
