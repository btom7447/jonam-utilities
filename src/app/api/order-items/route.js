import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";

export async function POST(req) {
    try {
        const body = await req.json();

        const newItem = await createRecord(process.env.AIRTABLE_ORDER_ITEM, body);

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error("Error creating order item:", error.message || error);
        return NextResponse.json({ error: "Failed to create order item: " + error.message }, { status: 500 });
    }
}
