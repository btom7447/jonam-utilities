import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema(
  {
    email_address: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "subscribed", "unsubscribed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Newsletter ||
  mongoose.model("Newsletter", NewsletterSchema);
