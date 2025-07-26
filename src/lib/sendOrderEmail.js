// /lib/sendOrderEmail.js

export const sendOrderEmail = async (orderDetails) => {
  const message = formatToEmail(orderDetails); // Make it readable

  try {
    const res = await fetch("https://formspree.io/f/yourFormID", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_email: orderDetails.customer.email,
        message,
      }),
    });

    const result = await res.json();
    if (!result.ok && !result.success) {
      throw new Error("Failed to send order email");
    }

    console.log("Order email sent successfully");
  } catch (err) {
    console.error("Email send error:", err);
  }
};

function formatToEmail(order) {
  const items = order.items
    .map(
      (item) =>
        `- ${item.name} (Qty: ${item.quantity}) - ₦${item.price.toLocaleString()}`
    )
    .join("\n");

  return `
Order ID: ${order.orderId}
Customer: ${order.customer.name}
Phone: ${order.customer.phone}
Email: ${order.customer.email}
State: ${order.customer.state}

Delivery: ${order.delivery.option} - ₦${order.delivery.fee.toLocaleString()}
Total Paid: ₦${order.payment.total.toLocaleString()}

Items:\n${items}

Placed at: ${order.placedAt}

If you have any issues with your order, reply to this email or contact jonamengr@gmail.com.
`;
}
