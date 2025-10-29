import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    order_total: { type: Number, required: true },
    customer_name: { type: String, required: true },
    customer_number: { type: String, required: true },
    customer_email: { type: String, required: true },
    payment_option: {
      type: String,
      enum: ["paystack", "cash_on_delivery"],
      required: true,
    },
    delivery_state: { type: String, required: true },
    delivery_price: { type: Number, required: true },
    order_date: { type: String, required: true },
    order_items_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem", // ✅ matches model name
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);