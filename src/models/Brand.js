import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: String,
    image: [
      {
        url: String,
      },
    ], // e.g. logo URL
    product_link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // link to products collection
    },
  },
  { timestamps: true }
);

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
