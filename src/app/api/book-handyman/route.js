import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking"; // Use Booking, not Handyman
import { sendNotification } from "@/lib/sendNotification";

// ✉️ Booking Email Template
const bookingEmailTemplate = ({
  handyman_name,
  customer_name,
  customer_email,
  customer_number,
  customer_address,
  service_type,
  booking_date,
  additional_notes,
}) => `
  <div style="font-family: 'DM Sans', sans-serif; background:#fff; color:#1e1e1e; padding:32px 24px; max-width:600px; margin:0 auto; border:2px solid #f1f1f1;">
    <h2 style="color:#1E40AF; font-weight:700; margin-bottom:16px; font-size:22px;">📅 New Handyman Booking</h2>

    <p>A new handyman booking has been submitted via the <strong style="color:#8b4513;">Hire Form</strong> on the Jonam Platform.</p>

    <div style="background:#f9fafb; padding:16px; border:1px solid #e5e7eb; margin-bottom:20px;">
      <p><strong>Handyman:</strong> ${handyman_name}</p>
      <p><strong>Customer Name:</strong> ${customer_name}</p>
      <p><strong>Customer Email:</strong> ${customer_email}</p>
      <p><strong>Phone Number:</strong> ${customer_number}</p>
      <p><strong>Service Type:</strong> ${service_type}</p>
      <p><strong>Booking Date:</strong> ${booking_date}</p>
      <p><strong>Address:</strong> ${customer_address}</p>
      ${
        additional_notes
          ? `<p><strong>Additional Notes:</strong></p>
             <blockquote style="border-left:2px solid #1E40AF; padding-left:10px; color:#4b5563;">${additional_notes}</blockquote>`
          : ""
      }
    </div>

    <a href="https://jonam.ng/admin/bookings" style="display:inline-block; background:#1E40AF; color:#fff; text-decoration:none; padding:12px 30px; font-weight:300;">View in Dashboard</a>

    <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;">
    <small style="color:#6b7280;">This is an automated notification from <a href="https://jonam.ng/" style="color:#8b4513;">Jonam Utilities</a>. Please do not reply directly to this email.</small>
  </div>
`;

export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("GET /bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // 1️⃣ Create Booking in DB
    const booking = await Booking.create(body);

    // 2️⃣ Build email HTML
    const formattedHTML = bookingEmailTemplate({
      handyman_name: body.handyman_name,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_number: body.customer_number,
      customer_address: body.customer_address,
      service_type: body.service_type,
      booking_date: body.booking_date,
      additional_notes: body.additional_notes,
    });

    // 3️⃣ Send notification
    await sendNotification({
      subject: `New Booking: ${body.customer_name} for ${body.service_type}`,
      message: formattedHTML,
      formType: "book",
      extraRecipients: ["management@jonam.ng"], // optional
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST /book-handyman error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
