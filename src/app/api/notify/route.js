export async function POST(req) {
  const { subject, message, formType, extraRecipients } = await req.json();

  // ✅ Dynamic import (so Vercel doesn’t try to bundle `resend`)
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 🧩 Define your recipient map
  const recipientMap = {
    contact: ["contact@jonam.ng"],
    management: ["management@jonam.ng"],
    order: ["orders@jonam.ng", "management@jonam.ng"], // Orders go to both
    quote: ["info@jonam.ng"],
  };

  // ✅ Always include director
  const baseRecipients = ["director@jonam.ng", "developer@jonam.ng"];

  // Merge logic
  let recipients = [
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

  try {
    await resend.emails.send({
      from: "Jonam Platform <noreply@jonam.ng>",
      to: recipients,
      subject: subject || "New Notification",
      html: message || "<p>No message content</p>",
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
