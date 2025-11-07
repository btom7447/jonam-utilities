// /app/api/notify/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { subject, message, formType, extraRecipients } = await req.json();

    // 🧠 Lazy import so Resend only loads server-side
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 📍 Automatic recipient routing
    const recipientMap = {
      contact: ["contact@jonam.ng", "management@jonam.ng"],
      management: ["management@jonam.ng"],
      order: ["orders@jonam.ng", "management@jonam.ng"],
      quote: ["info@jonam.ng", "management@jonam.ng"],
      book: ["bookings@jonam.ng", "management@jonam.ng"],
    };

    // 📧 Always CC core team
    const baseRecipients = ["director@jonam.ng", "developer@jonam.ng"];

    // 🧩 Merge & deduplicate recipients
    const recipients = [
      ...new Set([
        ...baseRecipients,
        ...(recipientMap[formType] || []),
        ...(Array.isArray(extraRecipients)
          ? extraRecipients
          : extraRecipients
          ? [extraRecipients]
          : []),
      ]),
    ];

    if (!recipients.length) throw new Error("No valid recipients found");
    if (!subject || !message)
      throw new Error("Missing subject or message content");

    // 📨 Send via Resend
    await resend.emails.send({
      from: "Jonam Utilities <noreply@jonam.ng>",
      to: recipients,
      subject,
      html: message,
    });

    console.log(`✅ Notification sent to: ${recipients.join(", ")}`);
    return NextResponse.json({ success: true, recipients });
  } catch (error) {
    console.error("❌ Email send error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
