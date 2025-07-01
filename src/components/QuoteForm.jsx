"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const serviceOptions = [
  "Installation",
  "Maintenance",
  "Repair",
  "Upgrade"
];

const QuoteForm = () => {
  const [activeInput, setActiveInput] = useState(null);
  const [selectedService, setSelectedService] = useState("");

  const fields = [
    { label: "Full Name", name: "name", type: "text" },
    { label: "Phone Number", name: "phone", type: "tel" },
    { label: "Email Address", name: "email", type: "email" },
  ];

  return (
    <form className="w-full xl:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto bg-white p-10 lg:p-20">
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

      {/* Service Dropdown */}
      <div className="relative group">
        <button
          type="button"
          onClick={() =>
            setActiveInput(activeInput === "service" ? null : "service")
          }
          className={`w-full flex justify-between items-center py-5 border-b-1 border-gray-500 text-xl bg-transparent cursor-pointer ${
            selectedService ? "text-black" : "text-gray-500"
          }`}
        >
          {selectedService || "Select a Service"}
          <ChevronDown size={20} />
        </button>

        {activeInput === "service" && (
          <ul className="absolute z-10 w-full max-h-80 overflow-y-auto bg-gray-900 border border-gray-900 mt-2">
            {serviceOptions.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setSelectedService(option);
                  setActiveInput(null);
                }}
                className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700 ${
                  selectedService === option ? "bg-blue-500" : ""
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
            ${activeInput === "service" ? "w-full bg-blue-500" : "w-0 bg-gray-900"} 
            group-hover:w-full group-hover:bg-blue-500`}
        ></span>
      </div>

      {/* Request Details */}
      <div className="relative group md:col-span-2">
        <textarea
          name="details"
          id="details"
          placeholder="Briefly describe your request"
          rows={3}
          onFocus={() => setActiveInput("details")}
          onBlur={() => setActiveInput(null)}
          className="w-full text-xl py-5 border-b-1 outline-none bg-transparent resize-none border-gray-500 text-black transition-all duration-300"
        />
        <span
          className={`absolute left-0 bottom-1.5 h-0.5 
            transition-all duration-200 
            ${activeInput === "details" ? "w-full bg-blue-500" : "w-0 bg-gray-700"} 
            group-hover:w-full group-hover:bg-blue-500`}
        ></span>
      </div>

      <button
        type="submit"
        className="py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer"
      >
        Request a Quote
      </button>
    </form>
  );
};

export default QuoteForm;
