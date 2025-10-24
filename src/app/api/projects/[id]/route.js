import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

// --- GET single project ---
export async function GET(_, { params }) {
  try {
    await connectDB();
    const project = await Project.findById(params.id);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PUT (Full update) ---
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const updates = await request.json();

    // Normalize data types
    if (updates.date) updates.date = new Date(updates.date);
    if (typeof updates.featured === "string")
      updates.featured = updates.featured === "true";

    const project = await Project.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// --- PATCH (Partial update) ---
// 👇 Reuses the same logic as PUT
export async function PATCH(request, ctx) {
  return PUT(request, ctx);
}

// --- DELETE ---
export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(params.id);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
