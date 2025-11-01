"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { loadOrCreateUserProfile } from "../lib/firestoreUser";

export default function BillingDetails({
  getTotalPrice,
  setDeliveryPrice,
  deliveryPrice,
  setDeliveryState,
  billingDetails,
  setBillingDetails,
}) {
  const [activeInput, setActiveInput] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch logistics (state + price)
  useEffect(() => {
    const fetchLogistics = async () => {
      try {
        const res = await fetch("/api/logistics");
        if (!res.ok) throw new Error("Failed to fetch logistics data");
        const data = await res.json();

        // Format for easier access
        const formatted = data.map((item) => ({
          label: item.state,
          value: item.state,
          price: item.price,
        }));

        setStateOptions(formatted);
      } catch (err) {
        console.error("Error fetching logistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogistics();
  }, []);

  // 🔹 Auto-populate from Firebase profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      try {
        const data = await loadOrCreateUserProfile(currentUser);
        const state = data?.deliveryAddress?.state || "";

        setBillingDetails({
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || currentUser.email || "",
          address: data?.deliveryAddress?.address || "",
          state,
        });

        // Wait until logistics is loaded before setting delivery info
        if (state) {
          const interval = setInterval(() => {
            if (stateOptions.length > 0) {
              const found = stateOptions.find(
                (opt) => opt.value.toLowerCase() === state.toLowerCase()
              );
              if (found) {
                setSelectedState(found.value);
                setDeliveryState(found.value);
                setDeliveryPrice(found.price);
              }
              clearInterval(interval);
            }
          }, 200);
        }
      } catch (error) {
        console.error("Error loading user billing info:", error);
      }
    });

    return () => unsubscribe();
  }, [stateOptions, setBillingDetails, setDeliveryPrice, setDeliveryState]);

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Phone", name: "phone", type: "tel" },
    { label: "Email", name: "email", type: "email" },
    { label: "Address", name: "address", type: "text" },
  ];

  const handleStateSelect = (state) => {
    const match = stateOptions.find((opt) => opt.value === state);
    if (!match) return;

    setSelectedState(match.value);
    setDeliveryState(match.value);
    setDeliveryPrice(match.price);
    setBillingDetails((prev) => ({ ...prev, state: match.value }));
    setActiveInput(null);
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
              className="w-full text-xl py-5 border-b border-gray-500 outline-none bg-transparent text-black transition-all duration-300"
            />
            <span
              className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
                activeInput === name ? "w-full bg-blue-500" : "w-0 bg-gray-900"
              } group-hover:w-full group-hover:bg-blue-500`}
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
            disabled={loading}
            className={`w-full flex justify-between items-center py-5 border-b border-gray-500 text-xl bg-transparent cursor-pointer ${
              selectedState ? "text-black" : "text-gray-500"
            }`}
          >
            {loading ? "Loading states..." : selectedState || "Choose State"}
            <ChevronDown size={20} />
          </button>

          {activeInput === "state" && !loading && (
            <ul className="absolute z-10 w-full max-h-80 overflow-y-auto bg-gray-900 border border-gray-900 mt-2">
              {stateOptions.map(({ label }) => (
                <li
                  key={label}
                  onClick={() => handleStateSelect(label)}
                  className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700 ${
                    selectedState === label ? "bg-blue-500" : ""
                  }`}
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
          <span
            className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
              activeInput === "state" ? "w-full bg-blue-500" : "w-0 bg-gray-900"
            } group-hover:w-full group-hover:bg-blue-500`}
          ></span>
        </div>
      </form>
    </section>
  );
}
