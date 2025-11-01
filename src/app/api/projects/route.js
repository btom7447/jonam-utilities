import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // 🧹 1. Safely normalize fields
    const cleanData = {
      ...body,
      client_rating: body.client_rating ? Number(body.client_rating) : 0,
      date: body.date ? new Date(body.date) : undefined,
      // ✅ Clean image URLs — accept blob URLs (for dev) but strip invalid objects
      images: Array.isArray(body.images)
        ? body.images
            .filter((img) => img?.url && typeof img.url === "string")
            .map((img) => ({
              // keep blob URLs for local dev
              url: img.url.startsWith("blob:")
                ? img.url // temporary dev image
                : img.url.trim(),
            }))
        : [],
    };

    // 🧩 2. Fallback to empty array if missing
    if (!cleanData.images) cleanData.images = [];

    // 🧠 3. Create in Mongo
    const project = await Project.create(cleanData);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
