import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OrderItem from "@/models/OrderItem";

export async function GET() {
  try {
    await connectDB();
    const items = await OrderItem.find();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching order items:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order items" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    console.log("📦 Received raw order item payload:", data);
    console.log("📊 Parsed order item fields:", JSON.stringify(data, null, 2));

    if (!data || typeof data !== "object") {
      console.error("❌ Invalid data received:", data);
      return NextResponse.json(
        { error: "Invalid payload received by API" },
        { status: 400 }
      );
    }

    const newItem = await OrderItem.create({ ...data });

    console.log("✅ Successfully created order item:", newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating order item:", error.message);
    console.error("🧠 Error stack trace:", error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to create order item" },
      { status: 500 }
    );
  }
}
