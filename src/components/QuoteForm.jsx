"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";

const serviceOptions = [
  "installation",
  "maintenance",
  "repair",
  "upgrade"
];

const QuoteForm = () => {
  const [activeInput, setActiveInput] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    address: "",
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const payload = {
      full_name: formData.name,
      email_address: formData.email,
      phone_number: formData.phone,
      service_type: selectedService,
      description: formData.message,
    };
  
    try {
      const res = await fetch("/api/request-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Request sent!");
  
        // reset form
        setFormData({ name: "", phone: "", email: "", message: "", });
        setSelectedService("");
      } else {
        console.error(result.error);
        toast.error("Failed to send request");
      }
      } catch (error) {
        console.error("Booking error:", error);
        toast.error("Something went wrong");
      } finally {
        setIsSubmitting(false); 
      }
    };

  const fields = [
    { label: "Full Name", name: "name", type: "text", autoComplete: "name" },
    { label: "Phone Number", name: "phone", type: "tel", autoComplete: "tel" },
    { label: "Email Address", name: "email", type: "email", autoComplete: "email" },
  ];

  const isFormReady =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    formData.message?.trim() &&
    selectedService.trim();

  return (
    <form 
      onSubmit={handleSubmit}
      autoComplete="on"
      className="w-full xl:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto bg-white p-10 lg:p-20"
    >
      {fields.map(({ label, name, type, autoComplete }) => (
        <div key={name} className="relative group">
          <input
            type={type}
            name={name}
            autoComplete={autoComplete}
            value={formData[name]}
            onChange={handleInputChange}
            onFocus={() => setActiveInput(name)}
            onBlur={() => setActiveInput(null)}
            placeholder={label}
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
            selectedService ? "text-black capitalize" : "text-gray-500"
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
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          onFocus={() => setActiveInput("message")}
          onBlur={() => setActiveInput(null)}
          rows={3}
          placeholder="Briefly describe your request"
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
        disabled={!isFormReady || isSubmitting}
        className={`lg:col-span-2 py-7 px-10 text-xl flex items-center justify-center
          ${isFormReady && !isSubmitting ? "bg-blue-500 hover:bg-brown cursor-pointer" : "bg-gray-500 cursor-not-allowed"} 
          text-white transition-all duration-300`}
      >
        {isSubmitting ? <MoonLoader size={25} color="#fff" /> : "Request Quote"}
      </button>
    </form>
  );
};

export default QuoteForm;
