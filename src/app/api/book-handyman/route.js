import { NextResponse } from "next/server";
import { fetchBookings } from "@/lib/airtable";

export async function GET() {
    try {
        const bookings = await fetchBookings();
        return NextResponse.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const newBooking = await createRecord(process.env.AIRTABLE_BOOKINGS_NAME, body);
        return NextResponse.json(newBooking, { status: 201 });
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}


// export async function POST(req) {
//     const body = await req.json();
//     const result = await createBooking(body);

//     if (result.success) {
//         return NextResponse.json({ message: "Booking created", id: result.id }, { status: 201 });
//     } else {
//         return NextResponse.json({ message: "Booking failed", error: result.error }, { status: 500 });
//     }
// }
