import { NextResponse } from "next/server";
import { fetchOrders, createRecord } from "@/lib/airtable";

export async function GET() {
    try {
        const orders = await fetchOrders();
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

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
