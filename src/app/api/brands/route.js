import { NextResponse } from "next/server";
import { fetchBrands } from "@/lib/airtable";

export async function GET() {
  try {
    const brands = await fetchBrands();
    return NextResponse.json(brands || []);
  } catch (error) {
    console.error("API Error - /api/brands:", error);
    return NextResponse.json([], { status: 200 });
  }
}
