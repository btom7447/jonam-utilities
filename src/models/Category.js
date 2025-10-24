import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    name: { type: String, required: true },
    sub_title: String,
    description: String,
    status: String,
    images: [
      {
        url: String,
      },
    ],
    products_link: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ], // multiple products linked to this category
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
