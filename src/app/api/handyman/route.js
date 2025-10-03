import { NextResponse } from "next/server";
import { fetchHandyman } from "@/lib/airtable";

export async function GET() {
  try {
    const handyman = await fetchHandyman();
    return NextResponse.json(handyman || []);
  } catch (error) {
    console.error("API Error - /api/handyman:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}
