import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";

export async function GET() {
  try {
    console.log("📡 Connecting to MongoDB for GET /api/orders...");
    await connectDB();

    // ✅ Fetch orders and populate their items efficiently
    const orders = await Order.find()
      .populate({
        path: "order_items_id",
        model: OrderItem,
      })
      .sort({ createdAt: -1 }); // optional: newest first

    console.log(`✅ Retrieved ${orders.length} orders with populated items`);

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    console.log("🧾 Order data received:", data);

    // ✅ Step 1: Create the order first (using `new`, not `.create()`)
    const newOrder = new Order({
      customer_name: data.customer_name,
      customer_number: data.customer_number,
      customer_email: data.customer_email,
      payment_option: data.payment_option,
      delivery_state: data.delivery_state,
      delivery_price: data.delivery_price,
      order_total: data.order_total,
      order_date: data.order_date,
      status: data.status || "pending",
    });

    await newOrder.save(); // create the order record in DB first

    // ✅ Step 2: Create order items linked to that order
    if (Array.isArray(data.items) && data.items.length > 0) {
      const orderItems = await Promise.all(
        data.items.map(async (item) => {
          const orderItem = await OrderItem.create({
            ...item,
            orders_link: newOrder._id,
          });
          return orderItem._id;
        })
      );

      // ✅ Step 3: Update order with item IDs
      newOrder.order_items_id = orderItems;
      await newOrder.save(); // persist the updated order
    } else {
      console.warn("⚠️ No items found in order payload");
    }

    // ✅ Step 4: Re-fetch final order with populated items
    const savedOrder = await Order.findById(newOrder._id).populate(
      "order_items_id"
    );

    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}