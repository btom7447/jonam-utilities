import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    order_total: {
      type: String,
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_number: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    payment_option: {
      type: String,
      enum: ["paystack", "bank_transfer", "cash_on_delivery"],
      required: true,
    },
    delivery_state: {
      type: String,
      required: true,
    },
    delivery_price: {
      type: String,
      required: true,
    },
    order_date: {
      type: String,
      required: true,
    },
    customer_orders: {
      type: [Number], // array of linked product or cart IDs
    },
    order_items_id: {
      type: [Number], // references to order_items table
      ref: "OrderItem",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
