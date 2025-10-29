import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  product: { type: Number, required: true },
  product_number: { type: String, required: true },
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  product_images: [
    {
      name: { type: String },
      url: { type: String, required: true },
    },
  ],
  category: { type: String },
  brand: { type: String },
  unit_price: { type: Number, required: true },
  product_category: { type: String },
  orders_link: {
    type: Schema.Types.ObjectId,
    ref: "Order", // ✅ match model name of the parent
    required: true,
  },
});

// ✅ Use "OrderItem" as model name, but force the collection name to "order-items"
export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", OrderItemSchema, "order-items");
