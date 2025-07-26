"use client";

import React, { createContext, useContext } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const placeOrder = async ({ cartItems, billingDetails, deliveryState, deliveryOption, paymentOption, deliveryPrice, grandTotal }) => {
    try {
      // 1. Create Order via API
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
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderFields),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData?.error || "Failed to create order");
        const orderId = orderData.id;

    // 2. Create Order Items via API
    const itemPromises = cartItems.map(item => {
        const itemFields = {
            product: [item.recordId],
            orders_link: [orderId],
        };

        return fetch("/api/order-items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(itemFields),
        });
    });

    const responses = await Promise.all(itemPromises);
        for (const res of responses) {
            if (!res.ok) throw new Error("Failed to create one or more order items");
        }

        return { success: true, orderId };
        } catch (error) {
            console.error("Order placement error:", error);
            return { success: false, error };
        }
    };

    return (
        <OrderContext.Provider value={{ placeOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
