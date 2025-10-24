import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    product: {
      type: Number, // references Product ID
      required: true,
    },
    unit_price: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
    },
    product_number: {
      type: String,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_images: {
      type: [String],
    },
    product_category: {
      type: String,
    },
    orders_link: {
      type: Number, // reference to Order ID
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", OrderItemSchema);
