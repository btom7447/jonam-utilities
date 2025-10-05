import { NextResponse } from "next/server";
import { createProduct, fetchProducts } from "@/lib/airtable";

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

    // Validate minimal required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: "Name and price are required" },
        { status: 400 }
      );
    }

    const result = await createProduct(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.message || "Failed to create product",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Products API POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
