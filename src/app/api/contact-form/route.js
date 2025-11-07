import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { sendNotification } from "@/lib/sendNotification"; // ✅ use helper

// ✉️ Email template
const emailTemplate = ({ name, email, subject, formType, messagePreview }) => `
  <div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #ffffff; color: #1e1e1e; padding: 32px 24px; max-width: 600px; margin: 0 auto; border: 2px solid #f1f1f1;">
    <h2 style="color: #1E40AF; font-weight: 700; margin-bottom: 16px; font-size: 22px;">
      📬 New Contact Form Submission
    </h2>

    <p style="margin-bottom: 16px; line-height: 1.6;">
      A new message has been submitted via the 
      <strong style="color: #8b4513;">${formType}</strong> form on the Jonam Platform.
    </p>

    <div style="background-color: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
      <p><strong>From:</strong> ${name || "Anonymous"} (${
  email || "No email"
})</p>
      <p><strong>Subject:</strong> ${subject || "No subject"}</p>
      <p><strong>Message Preview:</strong></p>
      <blockquote style="border-left: 2px solid #1E40AF; padding-left: 10px; color: #4b5563;">
        ${messagePreview || "No message preview available."}
      </blockquote>
    </div>

    <a href="https://jonam.ng/admin/contacts"
      style="display: inline-block; background-color: #1E40AF; color: #fff; text-decoration: none;
      padding: 12px 30px; font-weight: 300;">View in Dashboard</a>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <small style="color: #6b7280;">
      This is an automated notification from <a href="https://jonam.ng/" style="color:#8b4513;">Jonam Utilities</a>.
    </small>
  </div>
`;

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newContact = await Contact.create(body);

    // 📨 Build email
    const messagePreview = body.message
      ? body.message.slice(0, 200) + (body.message.length > 200 ? "..." : "")
      : "No message provided";

    const formattedHTML = emailTemplate({
      name: body.full_name,
      email: body.email_address,
      subject: body.subject || "Contact Form Message",
      formType: "contact",
      messagePreview,
    });

    // 🔔 Centralized notification call
    await sendNotification({
      subject: `New Contact Message from ${body.full_name || "Unknown User"}`,
      message: formattedHTML,
      formType: "contact",
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("POST /contact error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
