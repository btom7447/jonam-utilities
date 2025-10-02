import { NextResponse } from "next/server";
import { updateBookings, deleteBooking } from "@/lib/airtable";

export async function PATCH(req, { params }) {
    const { id } = params; // Airtable recordId
    // console.log("PATCH /api/orders/:id called with recordId:", id);

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

        const updatedBooking = await updateBookings(
            process.env.AIRTABLE_BOOKINGS_NAME,
            id,
            { status: body.status } // raw fields, updateOrders will wrap into { fields: ... }
        );

        console.log("Booking after Airtable update:", updatedBooking);

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json(
            { error: "Failed to update booking" },
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
        const deleted = await deleteBooking(process.env.AIRTABLE_BOOKINGS_NAME, id);
        return NextResponse.json({ success: true, deleted });
    } catch (err) {
        console.error("Failed to delete booking:", err);
        return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
    }
}
