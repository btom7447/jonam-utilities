import { NextResponse } from "next/server";
import { fetchProjectById } from "@/lib/airtable";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing project ID" },
        { status: 400 }
      );
    }

    const project = await fetchProjectById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 200 } // ✅ Return 200 with empty object, not 404
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("API Error - /api/project-details:", error);
    return NextResponse.json({}, { status: 200 }); // ✅ Fallback with empty object
  }
}
