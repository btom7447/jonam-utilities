import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";

// 🟢 GET /api/orders/[id]
export async function GET(req, { params }) {
  try {
    await connectDB();
    const order = await Order.findById(params.id).populate("order_items_id");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// 🟡 PUT /api/orders/[id]
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const data = await req.json();

    const existingOrder = await Order.findById(params.id);
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ Update main order fields
    Object.assign(existingOrder, {
      customer_name: data.customer_name ?? existingOrder.customer_name,
      customer_number: data.customer_number ?? existingOrder.customer_number,
      customer_email: data.customer_email ?? existingOrder.customer_email,
      payment_option: data.payment_option ?? existingOrder.payment_option,
      delivery_state: data.delivery_state ?? existingOrder.delivery_state,
      delivery_price: data.delivery_price ?? existingOrder.delivery_price,
      order_total: data.order_total ?? existingOrder.order_total,
      order_date: data.order_date ?? existingOrder.order_date,
      status: data.status ?? existingOrder.status,
    });

    // ✅ Handle new items if provided
    if (Array.isArray(data.items) && data.items.length > 0) {
      // Optional: remove old linked items
      await OrderItem.deleteMany({ orders_link: existingOrder._id });

      const newItems = await Promise.all(
        data.items.map((item) =>
          OrderItem.create({ ...item, orders_link: existingOrder._id })
        )
      );

      existingOrder.order_items_id = newItems.map((i) => i._id);
    }

    await existingOrder.save();

    const updatedOrder = await Order.findById(existingOrder._id).populate(
      "order_items_id"
    );

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE /api/orders/[id]
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await OrderItem.deleteMany({ orders_link: order._id });
    await Order.findByIdAndDelete(order._id);

    return NextResponse.json(
      { message: "Order and related items deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}

// 🟣 PATCH /api/orders/[id]
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ Update only allowed fields
    if (data.status !== undefined) {
      existingOrder.status = data.status;
    }

    if (Array.isArray(data.order_items_id)) {
      existingOrder.order_items_id = data.order_items_id;
    }

    // ❌ Reject if no valid fields are provided
    if (
      data.status === undefined &&
      !Array.isArray(data.order_items_id)
    ) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    await existingOrder.save();

    const updatedOrder = await Order.findById(id).populate("order_items_id");
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("❌ Error patching order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to patch order" },
      { status: 500 }
    );
  }
}
