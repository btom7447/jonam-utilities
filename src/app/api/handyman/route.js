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

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // ✅ Optional: format image URLs for Airtable
    if (body.image && Array.isArray(body.image)) {
      body.image = body.image.map((img) => (typeof img === "string" ? { url: img } : { url: img.url }));
    }

    const newHandyman = await createHandyman(process.env.AIRTABLE_HANDYMAN_NAME, body);

    return NextResponse.json(newHandyman);
  } catch (error) {
    console.error("Error creating handyman:", error);
    return NextResponse.json({ error: error.message || "Failed to create handyman" }, { status: 500 });
  }
}
