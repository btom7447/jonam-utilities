import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

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

    // --- 🔔 Trigger Resend notification ---
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "https://jonam.ng"}/api/notify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `New Contact Message from ${
              body.full_name || "Unknown User"
            }`,
            message: `
            <h3>Contact Message</h3>
            <p><strong>Name:</strong> ${body.full_name}</p>
            <p><strong>Email:</strong> ${body.email_address}</p>
            <p><strong>Phone:</strong> ${body.phone_number}</p>
            <p><strong>State:</strong> ${body.state}</p>
            <p><strong>Message:</strong> ${body.message}</p>
          `,
            formType: "contact",
          }),
        }
      );
    } catch (emailErr) {
      console.error("Failed to send contact email:", emailErr);
    }

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
