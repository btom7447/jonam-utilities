// /app/api/request-quote/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import RequestQuote from "@/models/RequestQuote";

// ✅ Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 🟢 GET a single quote by ID
export async function GET(_, { params }) {
  try {
    await connectDB();

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 });
    }

    const quote = await RequestQuote.findById(id);
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("GET /request-quote/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 PATCH (update) a quote by ID
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 });
    }

    const updates = await request.json();
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    const updatedQuote = await RequestQuote.findByIdAndUpdate(id, updates, {
      new: true, // return the updated document
    });

    if (!updatedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error("PATCH /request-quote/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE a quote by ID
export async function DELETE(_, { params }) {
  try {
    await connectDB();

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 });
    }

    const deletedQuote = await RequestQuote.findByIdAndDelete(id);

    if (!deletedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quote deleted successfully" });
  } catch (error) {
    console.error("DELETE /request-quote/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
