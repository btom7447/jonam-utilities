import { NextResponse } from "next/server";
import { fetchProjects } from "@/lib/airtable";

export async function GET() {
  try {
    const projects = await fetchProjects();
    return NextResponse.json(projects || []);
  } catch (error) {
    console.error("API Error - /api/projects:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}
