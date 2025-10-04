import { NextResponse } from "next/server";
import { getOrderItems, createRecord } from "@/lib/airtable";

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

// ✅ POST /api/order-items  ← handles creating order items after checkout
export async function POST(req) {
  try {
    const body = await req.json();

    // Expecting { product: ["recXXX"], orders_link: ["recYYY"], ... }
    if (!body?.product || !body?.orders_link) {
      return NextResponse.json({ error: "Missing product or order link" }, { status: 400 });
    }

    const newItem = await createRecord(process.env.AIRTABLE_ORDER_ITEMS_NAME, body);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating order item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order item" },
      { status: 500 }
    );
  }
}
