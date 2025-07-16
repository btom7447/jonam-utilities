"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// Object with delivery prices for each state
const stateOptions = {
  "Abia": 3000,
  "Adamawa": 4500,
  "Akwa Ibom": 3000,
  "Anambra": 2500,
  "Bauchi": 4000,
  "Bayelsa": 3000,
  "Benue": 3500,
  "Borno": 5000,
  "Cross River": 3000,
  "Delta": 3000,
  "Ebonyi": 2800,
  "Edo": 2500,
  "Ekiti": 2500,
  "Enugu": 2700,
  "FCT - Abuja": 2000,
  "Gombe": 4500,
  "Imo": 2600,
  "Jigawa": 5000,
  "Kaduna": 3800,
  "Kano": 4000,
  "Katsina": 5000,
  "Kebbi": 5000,
  "Kogi": 3000,
  "Kwara": 2800,
  "Lagos": 1500,
  "Nasarawa": 2500,
  "Niger": 3000,
  "Ogun": 2000,
  "Ondo": 2500,
  "Osun": 2300,
  "Oyo": 2200,
  "Plateau": 3600,
  "Rivers": 3200,
  "Sokoto": 5000,
  "Taraba": 4800,
  "Yobe": 5200,
  "Zamfara": 5000
};

const BillingDetails = ({ setDeliveryPrice }) => {
    const [activeInput, setActiveInput] = useState(null);
    const [selectedState, setSelectedState] = useState("");

    const fields = [
        { label: "Name", name: "name", type: "text" },
        { label: "Phone", name: "phone", type: "tel" },
        { label: "Email", name: "email", type: "email" },
    ];

    const handleStateSelect = (state) => {
        setSelectedState(state);
        setActiveInput(null);
        setDeliveryPrice(stateOptions[state]); // 👈 Set the price here
    };

    return (
        <section className="col-span-1">
            <h2 className="text-3xl font-semibold text-gray-900 mb-5">Billing Details</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {fields.map(({ label, name, type }) => (
                    <div key={name} className="relative group">
                        <input
                            type={type}
                            name={name}
                            id={name}
                            placeholder={label}
                            onFocus={() => setActiveInput(name)}
                            onBlur={() => setActiveInput(null)}
                            className="w-full text-xl py-5 border-b-1 outline-none bg-transparent border-gray-500 text-black transition-all duration-300"
                        />
                        <span
                            className={`absolute left-0 bottom-0 h-0.5 
                            transition-all duration-200
                            ${activeInput === name ? "w-full bg-blue-500" : "w-0 bg-gray-900"} 
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
                        <ul className="stateOption absolute z-10 w-full max-h-80 overflow-y-auto bg-gray-900 border border-gray-900 mt-2">
                            {Object.keys(stateOptions).map((state) => (
                                <li
                                    key={state}
                                    onClick={() => handleStateSelect(state)}
                                    className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700  ${
                                        selectedState === state ? "bg-blue-500" : ""
                                    }`}
                                >
                                    {state}
                                </li>
                            ))}
                        </ul>
                    )}

                    <span
                        className={`absolute left-0 bottom-0 h-0.5 
                        transition-all duration-200
                        ${activeInput === "state" ? "w-full bg-blue-500" : "w-0 bg-gray-900"} 
                        group-hover:w-full group-hover:bg-blue-500`}
                    ></span>
                </div>

                {/* Message - full span */}
                <div className="relative group md:col-span-2">
                    <textarea
                        name="message"
                        id="message"
                        placeholder="Your Message"
                        rows={3}
                        onFocus={() => setActiveInput("message")}
                        onBlur={() => setActiveInput(null)}
                        className="w-full text-xl py-5 border-b-1 outline-none bg-transparent resize-none border-gray-500 text-black transition-all duration-300"
                    />
                    <span
                        className={`absolute left-0 bottom-1.5 h-0.5 
                        transition-all duration-200 
                        ${activeInput === "message" ? "w-full bg-blue-500" : "w-0 bg-gray-700"} 
                        group-hover:w-full group-hover:bg-blue-500`}
                    ></span>
                </div>

                <button
                    type="submit"
                    className="py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer"
                >
                    Get in touch
                </button>
            </form>
        </section>
    );
};

export default BillingDetails;
