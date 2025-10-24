import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Brand from "@/models/Brand";

connectDB();

// ✅ GET all brands
export async function GET() {
  try {
    const brands = await Brand.find();
    return NextResponse.json(brands);
  } catch (err) {
    console.error("GET /brands error:", err);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

// ✅ CREATE brand
export async function POST(req) {
  try {
    const data = await req.json();
    const brand = await Brand.create(data);
    return NextResponse.json(brand, { status: 201 });
  } catch (err) {
    console.error("POST /brands error:", err);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
