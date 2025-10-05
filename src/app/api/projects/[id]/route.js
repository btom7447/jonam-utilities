import { NextResponse } from "next/server";
import { updateProjects, deleteProject } from "@/lib/airtable";

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();
    console.log("PATCH request body:", body);

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    const updatedProject = await updateProjects(
      process.env.AIRTABLE_PROJECTS_NAME,
      id,
      body
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Record ID is required" },
      { status: 400 }
    );
  }

  try {
    const deleted = await deleteProject(process.env.AIRTABLE_PROJECTS_NAME, id);
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
