"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { loadOrCreateUserProfile } from "../lib/firestoreUser";

// Delivery prices by state
const stateOptions = {
  Abia: 3000,
  Adamawa: 4500,
  "Akwa Ibom": 3000,
  Anambra: 2500,
  Bauchi: 4000,
  Bayelsa: 3000,
  Benue: 3500,
  Borno: 5000,
  "Cross River": 3000,
  Delta: 3000,
  Ebonyi: 2800,
  Edo: 2500,
  Ekiti: 2500,
  Enugu: 2700,
  "FCT - Abuja": 2000,
  Gombe: 4500,
  Imo: 2600,
  Jigawa: 5000,
  Kaduna: 3800,
  Kano: 4000,
  Katsina: 5000,
  Kebbi: 5000,
  Kogi: 3000,
  Kwara: 2800,
  Lagos: 1500,
  Nasarawa: 2500,
  Niger: 3000,
  Ogun: 2000,
  Ondo: 2500,
  Osun: 2300,
  Oyo: 2200,
  Plateau: 3600,
  Rivers: 3200,
  Sokoto: 5000,
  Taraba: 4800,
  Yobe: 5200,
  Zamfara: 5000,
};

export default function BillingDetails({
  getTotalPrice,
  setDeliveryPrice,
  deliveryPrice,
  setDeliveryState,
  billingDetails,
  setBillingDetails,
}) {
  const [activeInput, setActiveInput] = useState(null);
  const [selectedState, setSelectedState] = useState("");

  // 🔹 Auto-populate from Firebase profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const data = await loadOrCreateUserProfile(currentUser);
          setBillingDetails({
            name: data?.name || "",
            phone: data?.phone || "",
            email: data?.email || currentUser.email || "",
            address: data?.deliveryAddress?.address || "",
            state: data?.deliveryAddress?.state || "",
          });

          if (data?.deliveryAddress?.state) {
            setSelectedState(data.deliveryAddress.state);
            setDeliveryState(data.deliveryAddress.state);
            setDeliveryPrice(stateOptions[data.deliveryAddress.state] || 0);
          }
        } catch (error) {
          console.error("Error loading user billing info:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [setBillingDetails, setDeliveryPrice, setDeliveryState]);

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Phone", name: "phone", type: "tel" },
    { label: "Email", name: "email", type: "email" },
    { label: "Address", name: "address", type: "text" },
  ];

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setDeliveryState(state);
    setActiveInput(null);
    setDeliveryPrice(stateOptions[state]);
    setBillingDetails((prev) => ({ ...prev, state }));
  };

  return (
    <section className="col-span-1">
      <h2 className="text-3xl font-semibold text-gray-900 mb-5">
        Billing Details
      </h2>

      <form className="grid grid-cols-1 gap-10">
        {fields.map(({ label, name, type }) => (
          <div key={name} className="relative group">
            <input
              type={type}
              name={name}
              id={name}
              placeholder={label}
              onFocus={() => setActiveInput(name)}
              onBlur={() => setActiveInput(null)}
              value={billingDetails[name] || ""}
              onChange={(e) =>
                setBillingDetails((prev) => ({
                  ...prev,
                  [name]: e.target.value,
                }))
              }
              className="w-full text-xl py-5 border-b-1 outline-none bg-transparent border-gray-500 text-black transition-all duration-300"
            />
            <span
              className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200
                ${
                  activeInput === name
                    ? "w-full bg-blue-500"
                    : "w-0 bg-gray-900"
                } 
                group-hover:w-full group-hover:bg-blue-500`}
            ></span>
          </div>
        ))}

        {/* State Dropdown */}
        <div className="relative group">
          <button
            type="button"
            onClick={() =>
              setActiveInput(activeInput === "state" ? null : "state")
            }
            className={`w-full flex justify-between items-center py-5 border-b-1 border-gray-500 text-xl bg-transparent cursor-pointer ${
              selectedState ? "text-black" : "text-gray-500"
            }`}
          >
            {selectedState || "Choose State"}
            <ChevronDown size={20} />
          </button>

          {activeInput === "state" && (
            <ul className="absolute z-10 w-full max-h-80 overflow-y-auto bg-gray-900 border border-gray-900 mt-2">
              {Object.keys(stateOptions).map((state) => (
                <li
                  key={state}
                  onClick={() => handleStateSelect(state)}
                  className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700 ${
                    selectedState === state ? "bg-blue-500" : ""
                  }`}
                >
                  {state}
                </li>
              ))}
            </ul>
          )}
          <span
            className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200
              ${
                activeInput === "state"
                  ? "w-full bg-blue-500"
                  : "w-0 bg-gray-900"
              } 
              group-hover:w-full group-hover:bg-blue-500`}
          ></span>
        </div>
      </form>
    </section>
  );
}
