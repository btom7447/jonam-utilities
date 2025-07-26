export const formatOrderDetails = ({
  cartItems,
  billingDetails,
  deliveryState,
  deliveryOption,
  deliveryPrice,
  grandTotal,
  orderId
}) => {
  return {
    orderId,
    customer: {
      name: billingDetails.name,
      email: billingDetails.email,
      phone: billingDetails.phone,
      state: deliveryState,
    },
    delivery: {
      option: deliveryOption,
      fee: deliveryPrice,
    },
    payment: {
      total: grandTotal,
      currency: "NGN",
    },
    items: cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    })),
    placedAt: new Date().toLocaleString(),
  };
};
