import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

connectDB();

// ✅ UPDATE
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true, // <-- ensures schema validation
    });

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (err) {
    // <-- log full error
    console.error("Mongo error:", err);

    return NextResponse.json(
      { error: err.message }, // send actual error message back
      { status: 500 }
    );
  }
}


// ✅ DELETE
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("DELETE /categories/:id Error:", err);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
