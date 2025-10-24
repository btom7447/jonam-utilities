import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    product_number: { type: String, required: true, unique: true },

    name: { type: String, required: true },

    description: { type: String },

    price: { type: Number, required: true },

    discount: { type: Number, default: 0 }, // stored as plain number (e.g., 0.03 = 3%)

    quantity: { type: Number, default: 0 },

    featured: { type: Boolean, default: false },

    variants: [{ type: String }],

    product_colors: [{ type: String }],

    images: [
      {
        name: { type: String },
        url: { type: String, required: true },
      },
    ],

    // ---- Linked category / brand info ----
    category_link: { type: String }, // slug or reference id
    category: { type: String },

    brand_link: { type: String },
    brand: { type: String },

    // ---- Optional order relations ----
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
