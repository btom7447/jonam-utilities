import { NextResponse } from "next/server";
import { fetchProductById } from "@/lib/airtable";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    const product = await fetchProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 200 } // ✅ Return 200 with empty object, not 404
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("API Error - /api/product-details:", error);
    return NextResponse.json({}, { status: 200 }); // ✅ Fallback with empty object
  }
}
