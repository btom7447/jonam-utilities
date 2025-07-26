import { NextResponse } from "next/server";
import { fetchHandymanById } from "@/lib/airtable";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing handyman ID" },
        { status: 400 }
      );
    }

    const handyman = await fetchHandymanById(id);

    if (!handyman) {
      return NextResponse.json(
        { error: "Handyman not found" },
        { status: 200 } // ✅ Return 200 with empty object, not 404
      );
    }

    return NextResponse.json(handyman);
  } catch (error) {
    console.error("API Error - /api/handyman-details:", error);
    return NextResponse.json({}, { status: 200 }); // ✅ Fallback with empty object
  }
}
