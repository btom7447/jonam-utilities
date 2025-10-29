import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OrderItem from "@/models/OrderItem";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // Fetch a specific order item from "order-items"
    const item = await OrderItem.findById(params.id);

    if (!item)
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error fetching order item:", error);
    return NextResponse.json(
      { error: "Failed to fetch order item" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const updateData = await req.json();

    // Update a specific order item in "order-items"
    const updated = await OrderItem.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!updated)
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating order item:", error);
    return NextResponse.json(
      { error: "Failed to update order item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // Delete from the "order-items" collection
    await OrderItem.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Order item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting order item:", error);
    return NextResponse.json(
      { error: "Failed to delete order item" },
      { status: 500 }
    );
  }
}
