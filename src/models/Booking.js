import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    handyman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Handyman",
      required: true,
    },
    handyman_name: { type: String },
    handyman_image: { type: String },

    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    customer_number: { type: String, required: true },
    customer_address: { type: String, required: true },

    service_type: { type: String, required: true },
    booking_date: { type: Date, required: true },
    additional_notes: { type: String },

    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
