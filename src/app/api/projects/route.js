import { NextResponse } from "next/server";
import { createProjects, fetchProjects } from "@/lib/airtable";

export async function GET() {
  try {
    const projects = await fetchProjects();
    return NextResponse.json(projects || []);
  } catch (error) {
    console.error("API Error - /api/projects:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}


export async function POST(req) {
  try {
    const body = await req.json();

    // Validate minimal required fields
    if (!body.name || !body.client_name) {
      return NextResponse.json(
        { success: false, error: "Name and client are required" },
        { status: 400 }
      );
    }

    const result = await createProjects(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.message || "Failed to create project",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Project API POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
