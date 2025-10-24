import mongoose from "mongoose";

const HandymanSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    profile: { type: String },
    certifications: { type: String },
    image: [{ url: { type: String, required: true } }],
    rating: { type: Number, default: 0 },
    availability: { type: String },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    gigs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Handyman ||
  mongoose.model("Handyman", HandymanSchema);
