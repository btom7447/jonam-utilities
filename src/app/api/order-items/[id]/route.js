import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OrderItem from "@/models/OrderItem";

export async function GET(_, { params }) {
  try {
    await connectDB();
    const item = await OrderItem.findOne({ id: Number(params.id) });
    if (!item) {
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );
    }
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
    const data = await req.json();
    const updated = await OrderItem.findOneAndUpdate(
      { id: Number(params.id) },
      data,
      { new: true }
    );
    if (!updated) {
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating order item:", error);
    return NextResponse.json(
      { error: "Failed to update order item" },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const deleted = await OrderItem.findOneAndDelete({ id: Number(params.id) });
    if (!deleted) {
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );
    }
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
