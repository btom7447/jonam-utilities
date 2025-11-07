// /lib/sendNotification.js
export async function sendNotification({
  subject,
  message,
  formType,
  extraRecipients = [],
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://jonam.ng"}/api/notify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, formType, extraRecipients }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Notification send failed:", err);
      throw new Error(err.error || "Failed to send notification");
    }

    return true;
  } catch (error) {
    console.error("sendNotification error:", error);
    return false;
  }
}
