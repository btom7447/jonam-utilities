import { NextResponse } from "next/server";
import { getOrderItems } from "@/lib/airtable";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",").map((id) => id.trim());

  if (!ids?.length) {
    return NextResponse.json({ error: "No ids provided" }, { status: 400 });
  }

  try {
    const items = await getOrderItems(ids);
    return NextResponse.json(items);
  } catch (err) {
    console.error("Error fetching order items:", err);

    // ✅ Pass Airtable’s error details directly
    return NextResponse.json(
      { 
        error: err.message || "Unknown error",
        details: err, // includes Airtable’s error object
      },
      { status: 500 }
    );
  }
}
