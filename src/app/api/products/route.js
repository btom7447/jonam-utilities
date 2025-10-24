import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// ✅ GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ✅ POST create new product
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // ✅ Convert arrays to single ObjectIds
    if (Array.isArray(data.brand_link)) {
      data.brand_link = data.brand_link[0];
    }
    if (Array.isArray(data.category_link)) {
      data.category_link = data.category_link[0];
    }

    // ✅ Convert comma-separated strings to arrays
    if (typeof data.variants === "string") {
      data.variants = data.variants.split(",").map((v) => v.trim());
    }
    if (typeof data.product_colors === "string") {
      data.product_colors = data.product_colors.split(",").map((v) => v.trim());
    }

    const product = await Product.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: `Failed to create product: ${error.message}` },
      { status: 500 }
    );
  }
}