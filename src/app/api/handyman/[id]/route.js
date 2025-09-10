import { NextResponse } from "next/server";
import { updateHandyman, deleteHandyman } from "@/lib/airtable";

export async function PATCH(req, { params }) {
    const { id } = params;

    try {
        const body = await req.json();
        console.log("PATCH request body:", body);

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json(
                { error: "No fields provided to update" },
                { status: 400 }
            );
        }

        // ✅ Pass everything straight to Airtable
        const updatedHandyman = await updateHandyman(
            process.env.AIRTABLE_HANDYMAN_NAME,
            id,
            body
        );

        return NextResponse.json(updatedHandyman);
    } catch (error) {
        console.error("Error updating handyman:", error);
        return NextResponse.json({ error: "Failed to update handyman" }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    try {
        const deleted = await deleteBooking(process.env.AIRTABLE_HANDYMAN_NAME, id);
        return NextResponse.json({ success: true, deleted });
    } catch (err) {
        console.error("Failed to delete booking:", err);
        return NextResponse.json({ error: "Failed to delete handyman" }, { status: 500 });
    }
}
