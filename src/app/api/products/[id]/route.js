import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

// ✅ GET one product by _id
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );

    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// ✅ PUT update product by _id
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();

    // 🧩 Defensive fixes — make sure IDs are strings, not arrays
    if (Array.isArray(data.category_link)) {
      data.category_link = data.category_link[0];
    }
    if (Array.isArray(data.brand_link)) {
      data.brand_link = data.brand_link[0];
    }

    // 🧠 Perform update using _id
    const product = await Product.findByIdAndUpdate(params.id, data, {
      new: true,
    });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: `Failed to update product: ${error.message}` },
      { status: 500 }
    );
  }
}

// ✅ DELETE product by _id
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
