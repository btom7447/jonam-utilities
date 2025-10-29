"use client";

import { createContext, useContext } from "react";

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const placeOrder = async ({
    cartItems,
    billingDetails,
    deliveryState,
    deliveryOption,
    paymentOption,
    deliveryPrice,
    grandTotal,
  }) => {
    try {
      console.log("🛒 Raw cart items:", JSON.parse(JSON.stringify(cartItems)));
      console.log("📋 Billing details:", billingDetails);

      // 1️⃣ Create order first
      const orderFields = {
        customer_name: billingDetails.name,
        customer_number: billingDetails.phone,
        customer_email: billingDetails.email,
        delivery_state: deliveryState,
        delivery_option: deliveryOption,
        delivery_price: deliveryPrice,
        payment_option: paymentOption,
        order_total: grandTotal,
        status: "pending",
        order_date: new Date().toISOString(),
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderFields),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok)
        throw new Error(orderData?.error || "Failed to create order");

      const orderId = orderData._id;
      if (!orderId) throw new Error("❌ Missing order ID from backend");

      console.log("✅ Order created:", orderData);

      // 2️⃣ Prepare order items
      const formattedItems = cartItems.map((item, index) => {
        const cleanPrice =
          Number(String(item.price).replace(/[^\d.-]/g, "")) || 0;
        const cleanDiscount = item.discount
          ? Number(String(item.discount).replace(/[^\d.-]/g, "")) || 0
          : 0;

        return {
          product: index + 1,
          orders_link: orderId,
          product_number: item.product_number || `AUTO-${index + 1}`,
          product_name: item.name,
          price: cleanPrice * Number(item.quantity || 1),
          unit_price: cleanPrice,
          discount: cleanDiscount,
          quantity: Number(item.quantity) || 1,
          product_images: (item.images || []).map((img) => ({
            name: item.name,
            url: typeof img === "string" ? img : img.url || "",
          })),
          category: item.category || item.category_link || "Uncategorized",
          brand: item.brand || "Generic",
        };
      });

      console.log("🧾 Formatted order items:", formattedItems);

      // 3️⃣ Create order items
      const createdItems = await Promise.all(
        formattedItems.map(async (itemFields, idx) => {
          const res = await fetch("/api/order-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemFields),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(
              err?.error || `Failed to create order item #${idx + 1}`
            );
          }

          const successData = await res.json();
          console.log(`✅ Created order item [${idx + 1}]`, successData);
          return successData;
        })
      );

      const createdItemIds = createdItems.map((item) => item._id);
      console.log("🆔 Created order item IDs:", createdItemIds);

      // 4️⃣ PATCH order with linked items
      const updateRes = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_items_id: createdItemIds }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok)
        throw new Error(
          updateData?.error || "Failed to update order with items"
        );

      console.log("📦 Order updated successfully with items:", updateData);

      return { success: true, orderId, order: updateData };
    } catch (error) {
      console.error("❌ Order placement error:", error.message);
      return { success: false, error: error.message };
    }
  };

  return (
    <OrderContext.Provider value={{ placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
