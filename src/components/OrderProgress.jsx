// OrderProgress.jsx
"use client";

import React from "react";
import { useCheckout } from "@/contexts/checkoutContext";

const steps = ["Checkout", "Payment", "Order Confirmation"];

const OrderProgress = () => {
    const { step } = useCheckout();

    return (
        <div className="flex flex-wrap justify-center items-center w-full gap-5">
            {steps.map((label, index) => {
                const isActive = index === step;
                const isComplete = index < step;

                return (
                    <div key={label} className="flex items-center gap-5">
                        <div
                            className={`w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center text-sm font-semibold text-white ${
                                isComplete ? "bg-blue-500" : isActive ? "bg-brown" : "bg-gray-700" }`}
                        >
                            {index + 1}
                        </div>
                        <span
                            className={`text-md font-medium ${
                                isComplete ? "text-blue-500" : isActive ? "text-brown" : "text-gray-700"
                            }`}
                        >
                            {label}
                        </span>
                        {index < steps.length - 1 && (
                            <div 
                                className={`w-7 h-1 opacity-70 ${
                                    isComplete ? "bg-blue-500" : isActive ? "bg-brown" : "bg-gray-700"
                                }`} 
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default OrderProgress;