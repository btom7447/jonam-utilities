import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Logistics from "@/models/Logistics";

// ✅ Get one state
export async function GET(req, { params }) {
  try {
    await connectDB();
    const logistic = await Logistics.findById(params.id);
    if (!logistic)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(logistic);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ Update price only
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { price } = await req.json();
    if (price === undefined)
      return NextResponse.json(
        { error: "Missing price field" },
        { status: 400 }
      );

    const updated = await Logistics.findByIdAndUpdate(
      params.id,
      { price },
      { new: true }
    );
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating logistics:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
