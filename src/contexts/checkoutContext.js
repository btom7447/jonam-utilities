"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Step index mapping (reusable anywhere)
export const STEP_INDEX = {
    none: -1,     
    checkout: 0,
    payment: 1,
    place: 2,
    confirmation: 3,
};

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const STORAGE_KEY = "checkout-step";
    const [step, setStep] = useState(() => {
        if (typeof window !== "undefined") {
            const storedStep = localStorage.getItem(STORAGE_KEY);
            return storedStep ? parseInt(storedStep, 10) : STEP_INDEX.none;
        }
        return STEP_INDEX.checkout;
    });

  // Save to localStorage whenever step changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, step.toString());
        }
    }, [step]);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, STEP_INDEX.confirmation));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, STEP_INDEX.checkout));
    const resetSteps = () => setStep(STEP_INDEX.none);

    return (
        <CheckoutContext.Provider
            value={{
                step,
                setStep,
                nextStep,
                prevStep,
                resetSteps,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);