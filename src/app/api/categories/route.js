import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

// Connect DB
connectDB();

// ✅ CREATE
export async function POST(req) {
  try {
    const data = await req.json();
    const category = await Category.create(data);
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("POST /categories Error:", err);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// ✅ GET ALL
export async function GET() {
  try {
    const categories = await Category.find().populate("products_link");
    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET /categories Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
