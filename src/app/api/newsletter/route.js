import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { sendNotification } from "@/lib/sendNotification";

// ✉️ Newsletter Notification Email Template
const newsletterEmailTemplate = ({ subscriber_name, email_address }) => `
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
      📬 New Newsletter Subscription
    </h2>

    <p style="margin-bottom: 16px; line-height: 1.6;">
      A new subscriber has joined the Jonam newsletter.
    </p>

    <div style="
      background-color: #f9fafb;
      padding: 16px;
      border: 1px solid #e5e7eb;
      margin-bottom: 20px;
    ">
      <p style="margin:6px 0;"><strong>Email:</strong> ${email_address}</p>
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6;">
      Manage all newsletter subscribers in the admin dashboard:
    </p>

    <a href="https://jonam.ng/admin/newsletter"
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
      View Subscribers
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
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    return NextResponse.json(subscribers, { status: 200 });
  } catch (error) {
    console.error("GET /newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { full_name, email_address } = data;

    if (!email_address?.trim()) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const existing = await Newsletter.findOne({ email_address });
    if (existing) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 400 }
      );
    }

    const newSubscriber = await Newsletter.create({ full_name, email_address });

    // ✉️ Prepare notification email
    const formattedHTML = newsletterEmailTemplate({
      subscriber_name: full_name,
      email_address,
    });

    // 🔔 Send centralized notification
    await sendNotification({
      subject: `New Newsletter Subscription: ${full_name || email_address}`,
      message: formattedHTML,
      formType: "newsletter",
      extraRecipients: ["newsletter@jonam.ng"],
    });

    return NextResponse.json(newSubscriber, { status: 201 });
  } catch (error) {
    console.error("POST /newsletter error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
