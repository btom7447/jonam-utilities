import mongoose from "mongoose";

const quotesSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email_address: { type: String, required: true },
    description: { type: String, required: true },
    service_type: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.RequestQuote ||
  mongoose.model("Quotes", quotesSchema);
