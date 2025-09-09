import { NextResponse } from "next/server";
import { updateOrders, deleteOrder } from "@/lib/airtable";

export async function PATCH(req, { params }) {
    const { id } = params; // Airtable recordId
    console.log("PATCH /api/orders/:id called with recordId:", id);

    try {
        const body = await req.json();
        console.log("PATCH request body:", body);

            // Enforce only status update
            if (!body.status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400 }
            );
        }

        const updatedOrder = await updateOrders(
            process.env.AIRTABLE_ORDERS_NAME,
            id,
            { status: body.status } // raw fields, updateOrders will wrap into { fields: ... }
        );

        console.log("Order after Airtable update:", updatedOrder);

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    try {
        const deleted = await deleteOrder(process.env.AIRTABLE_ORDERS_NAME, id);
        return NextResponse.json({ success: true, deleted });
    } catch (err) {
        console.error("Failed to delete order:", err);
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}
