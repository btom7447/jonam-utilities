"use client";

import React, { useState } from "react";
import { STEP_INDEX, useCheckout } from "@/contexts/checkoutContext";
import { useOrder } from "@/contexts/orderContext";
import { initiatePaystackPayment } from "@/lib/paystack";
import { formatOrderDetails } from "@/lib/formOrderDetails";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { sendOrderEmail } from "@/lib/sendOrderEmail";

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
  if (!isFormValid) {
    toast.error("Please fill out all required fields.");
    return;
  }

  setLoading(true);

  if (selected === "paystack") {
    initiatePaystackPayment({
      billingDetails,
      grandTotal,
      onSuccess: async (response) => {
        try {
          const result = await placeOrder({
            cartItems,
            billingDetails,
            deliveryState,
            deliveryOption,
            deliveryPrice,
            paymentOption: "paystack",
            grandTotal,
            paystack_ref: response.reference,
          });

          if (result.success) {
            const orderDetails = formatOrderDetails({
              cartItems,
              billingDetails,
              deliveryState,
              deliveryOption,
              deliveryPrice,
              grandTotal,
              orderId: result.orderId,
            });

            console.log("Order receipt:", orderDetails);
            // await sendOrderEmail(orderDetails)

            toast.success("Payment successful! Order placed.");
            clearCart();
            resetSteps();
            setStep(STEP_INDEX.place);
          } else {
            toast.error("Order placement failed after payment.");
          }
        } catch (err) {
          toast.error("Unexpected error.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        toast.info("Payment was cancelled.");
        setLoading(false);
      },
    });
  } else {
    // Cash on delivery fallback
    try {
      const result = await placeOrder({
        cartItems,
        billingDetails,
        deliveryState,
        deliveryOption,
        deliveryPrice,
        paymentOption: "delivery",
        grandTotal,
      });

      if (result.success) {
        toast.success("Order placed with Cash on Delivery.");
        clearCart();
        resetSteps();
        setStep(STEP_INDEX.place);
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err) {
      toast.error("Unexpected error.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          type="button" 
          onClick={handlePlaceOrder}
          disabled={!isFormValid || loading}
          className={`flex items-center justify-center mt-10 mb-10 py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer ${
            loading || !isFormValid ? "bg-gray-500 cursor-not-allowed" : ""
          }`}
        >
          {loading ? <MoonLoader size={25} color="#fff" /> : "Place Order"}  
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
