import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Brand from "@/models/Brand";

connectDB();

// ✅ UPDATE brand
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    const updatedBrand = await Brand.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBrand);
  } catch (err) {
    console.error("PATCH /brands/:id error:", err);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

// ✅ DELETE brand
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (err) {
    console.error("DELETE /brands/:id error:", err);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
