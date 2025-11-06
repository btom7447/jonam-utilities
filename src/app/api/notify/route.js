import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { subject, message, formType } = await req.json();

  // Routing logic
  const baseRecipients = ["director@jonam.ng"];
  let recipients = [...baseRecipients];

  if (formType === "contact") recipients.push("contact@jonam.ng");
  if (formType === "management") recipients.push("management@jonam.ng");
  if (formType === "order") recipients.push("orders@jonam.ng");

  try {
    await resend.emails.send({
      from: "Jonam Platform <noreply@jonam.ng>",
      to: recipients,
      subject: subject || "New Notification",
      html: `<p>${message}</p>`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
