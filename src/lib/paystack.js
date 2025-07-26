// /lib/paystack.js
export const initiatePaystackPayment = ({ 
  billingDetails, 
  grandTotal, 
  onSuccess, 
  onClose 
}) => {
  if (!window.PaystackPop) {
    console.error("PaystackPop is not available.");
    return null;
  }

  const handler = window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: billingDetails.email,
    amount: grandTotal * 100, // Convert to kobo
    currency: "NGN",
    callback: function (response) {
      if (typeof onSuccess === "function") {
        onSuccess(response);
      } else {
        console.error("onSuccess is not a valid function.");
      }
    },
    onClose: () => {
      if (typeof onClose === "function") {
        onClose();
      }
    },
    metadata: {
      custom_fields: [
        {
          display_name: billingDetails.name,
          variable_name: "mobile_number",
          value: billingDetails.phone,
        },
        {
          display_name: "Order Total",
          variable_name: "order_total",
          value: `₦${grandTotal.toLocaleString()}`,
        },
      ],
    },
  });

  handler.openIframe();
};
