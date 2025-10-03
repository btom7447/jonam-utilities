import { NextResponse } from "next/server";
import { fetchProducts, createProduct } from "@/lib/airtable";

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products || []);
  } catch (error) {
    console.error("API Error - /api/products:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}