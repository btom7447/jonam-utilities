import { NextResponse } from "next/server";
import { fetchHandyman, createHandyman } from "@/lib/airtable";

export async function GET() {
  try {
    const handyman = await fetchHandyman();
    return NextResponse.json(handyman || []);
  } catch (error) {
    console.error("API Error - /api/handyman:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate minimal required fields
    if (!body.name || !body.profile) {
      return NextResponse.json(
        { success: false, error: "Name and profile are required" },
        { status: 400 }
      );
    }

    const result = await createHandyman(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.message || "Failed to create handyman",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Handyman API POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
