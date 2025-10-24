import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OrderItem from "@/models/OrderItem";

export async function GET() {
  try {
    await connectDB();
    const items = await OrderItem.find();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching order items:", error);
    return NextResponse.json(
      { error: "Failed to fetch order items" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Prevent duplicate IDs
    const existing = await OrderItem.findOne({ id: data.id });
    if (existing) {
      return NextResponse.json(
        { message: "Order item already exists" },
        { status: 400 }
      );
    }

    const newItem = await OrderItem.create(data);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating order item:", error);
    return NextResponse.json(
      { error: "Failed to create order item" },
      { status: 500 }
    );
  }
}
