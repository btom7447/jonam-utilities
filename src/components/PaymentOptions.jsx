"use client";

import React, { useState } from "react";
import { STEP_INDEX, useCheckout } from "@/contexts/checkoutContext";
import { useOrder } from "@/contexts/orderContext";
import { toast } from "react-toastify";

const PaymentOptions = ({
    clearCart,
    deliveryState,
    isFormValid,
    cartItems,
    billingDetails,
    deliveryOption,
    deliveryPrice,
    grandTotal
}) => {
  const { setStep, resetSteps } = useCheckout();
  const { placeOrder } = useOrder();
  const [selected, setSelected] = useState("paystack");
  const [loading, setLoading] = useState(false);

  const toggleOption = (option) => {
    setSelected(option);
  };

  const isDeliveryAvailable = ["Osun", "Lagos"].includes(deliveryState);

  const handlePlaceOrder = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
    const paymentOption = selected;

    const result = await placeOrder({
      cartItems,
      billingDetails,
      deliveryState,
      deliveryOption,
      deliveryPrice,
      paymentOption, 
      grandTotal
    });

      if (result.success) {
            toast.success("Your order has been placed!");
            clearCart();
            resetSteps();
            setStep(STEP_INDEX.place);
      } else {
            toast.error("Failed to place order. Try again.");
            console.error(result.error);
      }
    } catch (err) {
        toast.error("An unexpected error occurred.");
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-5">Payment</h3>

      <div className="bg-white p-10">
        {/* Cash on Delivery */}
        <div className="border-b border-gray-300 overflow-hidden transition-all duration-300">
          <button
            onClick={() => isDeliveryAvailable && toggleOption("delivery")}
            className="w-full flex justify-between items-center px-4 py-5 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                checked={selected === "delivery"}
                onChange={() => isDeliveryAvailable && setSelected("delivery")}
                disabled={!isDeliveryAvailable}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-xl font-semibold">Cash on Delivery</span>
              {!isDeliveryAvailable && (
                <span className="text-sm text-red-600 ml-2">
                  (Not available for your location)
                </span>
              )}
            </div>
          </button>

          <div
            className={`px-6 overflow-hidden transition-all duration-300 text-gray-700 text-base ${
              selected === "delivery"
                ? "max-h-40 py-5 opacity-100"
                : "max-h-0 py-0 opacity-0"
            }`}
          >
            You can pay for your order with cash or POS upon delivery to your address.
          </div>
        </div>

        {/* Paystack */}
        <div className="border-b border-dashed border-gray-300 overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleOption("paystack")}
            className="w-full flex justify-between items-center px-4 py-5 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                checked={selected === "paystack"}
                onChange={() => setSelected("paystack")}
              />
              <span className="text-xl font-semibold">Paystack</span>
            </div>
          </button>

          <div
            className={`px-6 overflow-hidden transition-all duration-300 text-gray-700 text-base ${
              selected === "paystack"
                ? "max-h-40 py-5 opacity-100"
                : "max-h-0 py-0 opacity-0"
            }`}
          >
            This is a secure online payment powered by Paystack. You’ll be redirected to complete your payment.
          </div>
        </div>

        <button
          type="submit"
          onClick={handlePlaceOrder}
          disabled={!isFormValid || loading}
          className={`mt-5 py-5 px-10 text-xl text-white transition-all ${
            isFormValid && !loading
              ? "bg-blue-500 hover:bg-brown cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
