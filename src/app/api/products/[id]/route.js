import { NextResponse } from "next/server";
import { updateProducts, deleteProduct } from "@/lib/airtable";

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();
    console.log("🟡 PATCH request body:", JSON.stringify(body, null, 2));

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // ✅ Update the product record in Airtable
    const updatedProduct = await updateProducts(
      process.env.AIRTABLE_PRODUCTS_NAME,
      id,
      body
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("🔴 Error updating product:", error);

    // Airtable sometimes nests message under error.response or error.message
    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.error?.message ||
      error?.message ||
      "Unknown Airtable error";

    console.error("🔍 Airtable detailed error:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Record ID is required" },
      { status: 400 }
    );
  }

  try {
    const deleted = await deleteProduct(process.env.AIRTABLE_PRODUCTS_NAME, id);
    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error("🔴 Failed to delete product:", err);
    const errorMessage =
      err?.response?.data?.error?.message ||
      err?.error?.message ||
      err?.message ||
      "Unknown Airtable error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
