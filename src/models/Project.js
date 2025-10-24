import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    client_name: { type: String },
    client_rating: { type: Number, default: 0 },
    client_review: { type: String },
    description: { type: String },
    date: { type: Date },
    status: { type: String, enum: ["draft", "publish"], default: "draft" },
    images: [
      {
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
