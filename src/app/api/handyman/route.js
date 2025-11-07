import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Handyman from "@/models/Handyman";
import { sendNotification } from "@/lib/sendNotification"; // ✅ centralized helper

// ✉️ Booking Notification Email Template
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
  <div style="
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #ffffff;
    color: #1e1e1e;
    padding: 32px 24px;
    max-width: 600px;
    margin: 0 auto;
    border: 2px solid #f1f1f1;
  ">
    <h2 style="
      color: #1E40AF;
      font-weight: 700;
      margin-bottom: 16px;
      font-size: 22px;
    ">
      📅 New Handyman Booking
    </h2>

    <p style="margin-bottom: 16px; line-height: 1.6;">
      A new handyman booking has been submitted via the 
      <strong style="color: #8b4513;">Hire Form</strong> on the Jonam Platform.
    </p>

    <div style="
      background-color: #f9fafb;
      padding: 16px;
      border: 1px solid #e5e7eb;
      margin-bottom: 20px;
    ">
      <p style="margin: 6px 0;"><strong>Handyman:</strong> ${handyman_name}</p>
      <p style="margin: 6px 0;"><strong>Customer Name:</strong> ${customer_name}</p>
      <p style="margin: 6px 0;"><strong>Customer Email:</strong> ${customer_email}</p>
      <p style="margin: 6px 0;"><strong>Phone Number:</strong> ${customer_number}</p>
      <p style="margin: 6px 0;"><strong>Service Type:</strong> ${service_type}</p>
      <p style="margin: 6px 0;"><strong>Booking Date:</strong> ${booking_date}</p>
      <p style="margin: 6px 0;"><strong>Address:</strong> ${customer_address}</p>

      ${
        additional_notes
          ? `<p style="margin-top: 10px;"><strong>Additional Notes:</strong></p>
             <blockquote style="
               border-left: 2px solid #1E40AF;
               padding-left: 10px;
               padding-top: 20px;
               padding-bottom: 20px;
               color: #4b5563;
               margin: 0;
             ">${additional_notes}</blockquote>`
          : ""
      }
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6;">
      You can manage this booking and update its status in the admin dashboard:
    </p>

    <a href="https://jonam.ng/admin/bookings"
      style="
        display: inline-block;
        background-color: #1E40AF;
        color: #ffffff;
        font-size: 18px;
        text-decoration: none;
        padding: 12px 30px;
        font-weight: 300;
      "
    >
      View Booking
    </a>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

    <small style="color: #6b7280; display: block; line-height: 1.5;">
      This is an automated notification from 
      <a href="https://jonam.ng/" style="color:#8b4513; display:inline-block">Jonam Utilities</a>.<br>
      Please do not reply directly to this email.
    </small>
  </div>
`;

export async function GET() {
  try {
    await connectDB();
    const handymen = await Handyman.find();
    return NextResponse.json(handymen);
  } catch (error) {
    console.error("GET /handyman error:", error);
    return NextResponse.json(
      { error: "Failed to fetch handymen" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const handyman = await Handyman.create(body);

    // --- ✉️ Prepare notification
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

    // --- 🔔 Centralized notification trigger
    await sendNotification({
      subject: `New Booking: ${body.customer_name} for ${body.service_type}`,
      message: formattedHTML,
      formType: "book",
      extraRecipients: ["management@jonam.ng"], // ✅ Optional additional recipients
    });

    return NextResponse.json(handyman, { status: 201 });
  } catch (error) {
    console.error("POST /book-handyman error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
