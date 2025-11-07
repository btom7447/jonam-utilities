import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import RequestQuote from "@/models/RequestQuote";
import { sendNotificationEmail } from "@/lib/sendNotificationEmail";

// ✉️ Quote Request Email Template
const quoteEmailTemplate = ({
  full_name,
  phone_number,
  email_address,
  service_type,
  description,
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
      🧾 New Quote Request
    </h2>

    <p style="margin-bottom: 16px; line-height: 1.6;">
      A new quote request has been submitted via the 
      <strong style="color: #8b4513;">Quote Form</strong> on the Jonam Platform.
    </p>

    <div style="
      background-color: #f9fafb;
      padding: 16px;
      border: 1px solid #e5e7eb;
      margin-bottom: 20px;
    ">
      <p style="margin: 6px 0;"><strong>Name:</strong> ${full_name}</p>
      <p style="margin: 6px 0;"><strong>Email:</strong> ${email_address}</p>
      <p style="margin: 6px 0;"><strong>Phone:</strong> ${phone_number}</p>
      <p style="margin: 6px 0;"><strong>Service Type:</strong> ${service_type}</p>
      <p style="margin-top: 10px;"><strong>Description:</strong></p>
      <blockquote style="
        border-left: 2px solid #1E40AF;
        padding-left: 10px;
        padding-top: 20px;
        padding-bottom: 20px;
        color: #4b5563;
        margin: 0;
      ">
        ${description}
      </blockquote>
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6;">
      You can view and manage this quote in your admin dashboard:
    </p>

    <a href="https://jonam.ng/admin/quotes"
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
      View Quote
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
    const quotes = await RequestQuote.find().sort({ createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("GET /api/request-quote error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      full_name,
      phone_number,
      email_address,
      service_type,
      description,
    } = body;

    if (
      !full_name?.trim() ||
      !phone_number?.trim() ||
      !email_address?.trim() ||
      !service_type?.trim() ||
      !description?.trim()
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const newQuote = await RequestQuote.create({
      full_name,
      phone_number,
      email_address,
      service_type,
      description,
    });

    // ✉️ Prepare email HTML
    const formattedHTML = quoteEmailTemplate({
      full_name,
      phone_number,
      email_address,
      service_type,
      description,
    });

    // 🔔 Notify via helper (uses receiptMap internally)
    await sendNotificationEmail({
      subject: `Quote Request: ${full_name} (${service_type})`,
      message: formattedHTML,
      formType: "quote",
      extraRecipients: ["info@jonam.ng"],
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    console.error("POST /api/request-quote error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
