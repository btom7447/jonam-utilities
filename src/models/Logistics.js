import mongoose from "mongoose";

const LogisticsSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Logistics ||
  mongoose.model("Logistics", LogisticsSchema);