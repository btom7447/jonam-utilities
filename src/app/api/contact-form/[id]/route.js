import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

// GET a single contact
export async function GET(req, { params }) {
  try {
    await connectDB();
    const contact = await Contact.findById(params.id);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH update a contact
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const updates = await req.json();
    const updatedContact = await Contact.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    );
    if (!updatedContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a contact
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deletedContact = await Contact.findByIdAndDelete(params.id);
    if (!deletedContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Contact deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
