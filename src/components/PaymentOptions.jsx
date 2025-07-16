"use client";

import React, { useState } from "react";
import { STEP_INDEX, useCheckout, } from "@/contexts/checkoutContext";
import { toast } from "react-toastify";

const PaymentOptions = ({ clearCart }) => {    
    const { setStep, resetSteps } = useCheckout();
    const [selected, setSelected] = useState("paystack");

    const toggleOption = (option) => {
        setSelected(option);
    };

    const handlePlaceOrder = () => {
        setStep(STEP_INDEX.place)
        // resetSteps();
        clearCart();
        toast.success("Your order has been placed!")
    };
    
    return (
        <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-5">Payment</h3>

            <div className="bg-white p-10">
                {/* Payment on Delivery Option */}
                <div className="border-b border-gray-300 overflow-hidden transition-all duration-300">
                    <button
                        onClick={() => toggleOption("delivery")}
                        className="w-full flex justify-between items-center px-4 py-5 text-left cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="payment"
                                checked={selected === "delivery"}
                                onChange={() => setSelected("delivery")}
                            />
                            <span className="text-xl font-semibold">Cash on Delivery</span>
                        </div>
                    </button>

                    <div
                        className={`px-6 overflow-hidden transition-all duration-300 text-gray-700 text-base ${
                        selected === "delivery" ? "max-h-40 py-5 opacity-100" : "max-h-0 py-0 opacity-0"
                        }`}
                    >
                        You can pay for your order with cash or POS upon delivery to your address.
                    </div>
                </div>

                {/* Paystack Option */}
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
                        selected === "paystack" ? "max-h-40 py-5 opacity-100" : "max-h-0 py-0 opacity-0"
                        }`}
                    >
                        This is a secure online payment powered by Paystack. You’ll be redirected to complete your payment.
                    </div>
                </div>

                <button type="submit" onClick={handlePlaceOrder} className="mt-5 py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer">Place Order</button>
            </div>
        </div>
    );
};

export default PaymentOptions;
