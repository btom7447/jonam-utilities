import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 🟢 GET a single subscriber
export async function GET(_, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid subscriber ID" },
        { status: 400 }
      );
    }

    const subscriber = await Newsletter.findById(id);
    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscriber, { status: 200 });
  } catch (error) {
    console.error("GET /newsletter/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 PATCH (update) subscriber
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid subscriber ID" },
        { status: 400 }
      );
    }

    const updates = await request.json();
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No data provided to update" },
        { status: 400 }
      );
    }

    const updatedSubscriber = await Newsletter.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedSubscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubscriber, { status: 200 });
  } catch (error) {
    console.error("PATCH /newsletter/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE a subscriber
export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid subscriber ID" },
        { status: 400 }
      );
    }

    const deleted = await Newsletter.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Unsubscribed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /newsletter/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
