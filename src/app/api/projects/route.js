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

    // ✅ Type conversions & cleanup
    const cleanData = {
      ...body,
      client_rating: body.client_rating ? Number(body.client_rating) : 0,
      date: body.date ? new Date(body.date) : undefined,
    };

    const project = await Project.create(cleanData);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
