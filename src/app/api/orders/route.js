import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";

export async function POST(req) {
    try {
        const body = await req.json();
        const newOrder = await createRecord(process.env.AIRTABLE_ORDERS_NAME, body);

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
