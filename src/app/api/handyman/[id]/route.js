import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Handyman from "@/models/Handyman";
import Booking from "@/models/Booking"; // Register model
import mongoose from "mongoose";

// ─── GET ONE HANDYMAN ──────────────────────────────
export async function GET(req, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const handyman = await Handyman.findById(params.id).populate("bookings");

    if (!handyman) {
      return NextResponse.json(
        { error: "Handyman not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(handyman);
  } catch (error) {
    console.error("❌ GET /api/handyman/[id] ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch handyman" },
      { status: 500 }
    );
  }
}

// ─── PATCH HANDYMAN (UPDATE) ───────────────────────
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await Handyman.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Handyman not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ PATCH /api/handyman/[id] ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update handyman" },
      { status: 500 }
    );
  }
}

// ─── DELETE HANDYMAN ───────────────────────────────
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const deleted = await Handyman.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Handyman not found" },
        { status: 404 }
      );
    }

    // Optional: also delete related bookings
    await Booking.deleteMany({ handyman: params.id });

    return NextResponse.json({ message: "Handyman deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE /api/handyman/[id] ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete handyman" },
      { status: 500 }
    );
  }
}
