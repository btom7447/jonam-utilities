"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const stateOptions = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara"
]

const ContactForm = () => {
    const [activeInput, setActiveInput] = useState(null);
    const [selectedState, setSelectedState] = useState("");

    const fields = [
        { label: "Name", name: "name", type: "text" },
        { label: "Phone", name: "phone", type: "tel" },
        { label: "Email", name: "email", type: "email" },
    ];

    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl mx-auto">
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
                    onClick={() => setActiveInput(activeInput === "state" ? null : "state")}
                    className={`w-full flex justify-between items-center py-5 border-b-1 border-gray-500 text-xl bg-transparent cursor-pointer ${
                        selectedState ? "text-black" : "text-gray-500"
                    }`}
                >
                    {selectedState || "Choose State"}
                    <ChevronDown size={20} />
                </button>

                {activeInput === "state" && (
                    <ul className="stateOption absolute z-10 w-full max-h-80 overflow-y-auto bg-gray-900 border border-gray-900 mt-2">
                        {stateOptions.map((option) => (
                            <li
                                key={option}
                                onClick={() => {
                                    setSelectedState(option);
                                    setActiveInput(null);
                                }}
                                    className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700  ${
                                    selectedState === option ? "bg-blue-500" : ""
                                }`}
                            >
                                {option}
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
            <button type="submit" className="py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer">Get in touch</button>
        </form>
    );
};

export default ContactForm;
