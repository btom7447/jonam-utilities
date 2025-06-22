import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/airtable";

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products || []);
  } catch (error) {
    console.error("API Error - /api/products:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}
