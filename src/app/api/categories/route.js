import { NextResponse } from "next/server";
import { fetchCategories } from "@/lib/airtable";

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json(categories || []);
  } catch (error) {
    console.error("API Error - /api/categories:", error);
    return NextResponse.json([], { status: 200 });
  }
}
