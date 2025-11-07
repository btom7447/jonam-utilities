import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";
import { sendNotification } from "@/lib/sendNotification"; // ✅ centralized helper

// ✉️ Order Notification Email Template
const orderEmailTemplate = ({
  customer_name,
  customer_email,
  customer_number,
  payment_option,
  order_total,
  order_date,
}) => {
  const formattedDate = new Date(order_date).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `
    <div style="font-family:'DM Sans', sans-serif; background:#fff; color:#1e1e1e; padding:32px 24px; max-width:600px; margin:0 auto; border:2px solid #f1f1f1;">
      <h2 style="color:#1E40AF; font-weight:700; margin-bottom:16px; font-size:24px;">🛒 New Order Received</h2>

      <p style="font-size:16px; line-height:1.6;">
        A new order has been placed on the Jonam Utilities website. Below are the key details:
      </p>

      <div style="background:#f9fafb; padding:20px; border:1px solid #e5e7eb; margin:20px 0;">
        <p style="margin:8px 0;"><strong>Customer:</strong> ${customer_name}</p>
        <p style="margin:8px 0;"><strong>Email:</strong> ${customer_email}</p>
        <p style="margin:8px 0;"><strong>Phone:</strong> ${customer_number}</p>
        <p style="margin:8px 0;"><strong>Payment:</strong> ${payment_option}</p>
        <p style="margin:8px 0;"><strong>Total:</strong> ₦${order_total.toLocaleString()}</p>
        <p style="margin:8px 0;"><strong>Order Date:</strong> ${formattedDate}</p>
      </div>

      <p style="font-size:16px; line-height:1.6;">
        For full order details and items, please check the admin dashboard.
      </p>

      <a href="https://jonam.ng/admin/orders"
        style="display:inline-block; background:#1E40AF; color:#fff; text-decoration:none; padding:12px 30px; font-weight:500; font-size:16px;">
        View Order Details
      </a>

      <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;">
      <small style="color:#6b7280; font-size:12px;">
        This is an automated notification from <a href="https://jonam.ng/" style="color:#8b4513;">Jonam Utilities</a>. Please do not reply to this email.
      </small>
    </div>
  `;
};

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find()
      .populate("order_items_id")
      .sort({ createdAt: -1 });
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

    // 1️⃣ Create the order
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

    await newOrder.save();

    // 2️⃣ Create and link order items
    let orderItems = [];
    if (Array.isArray(data.items) && data.items.length > 0) {
      orderItems = await Promise.all(
        data.items.map(async (item) => {
          const orderItem = await OrderItem.create({
            ...item,
            orders_link: newOrder._id,
          });
          return orderItem;
        })
      );
      newOrder.order_items_id = orderItems.map((i) => i._id);
      await newOrder.save();
    }

    // 3️⃣ Prepare email notification
    const formattedHTML = orderEmailTemplate({
      customer_name: newOrder.customer_name,
      customer_email: newOrder.customer_email,
      customer_number: newOrder.customer_number,
      payment_option: newOrder.payment_option,
      delivery_state: newOrder.delivery_state,
      delivery_price: newOrder.delivery_price,
      order_total: newOrder.order_total,
      order_date: newOrder.order_date,
      items: orderItems,
    });

    // 4️⃣ Send centralized notification
    await sendNotification({
      subject: `New Order from ${newOrder.customer_name}`,
      message: formattedHTML,
      formType: "order",
      extraRecipients: ["management@jonam.ng"], // optional
    });

    // 5️⃣ Return saved order
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
