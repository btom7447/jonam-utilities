"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
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
        state: selectedState,
        message: formData.message,
        };
    
        try {
        const res = await fetch("/api/contact-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (res.ok) {
            toast.success("Message sent!");
    
            // reset form
            setFormData({ name: "", phone: "", email: "", message: "", });
            setSelectedState("");
        } else {
            console.error(result.error);
            toast.error("Failed to send message");
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
    selectedState.trim();

    return (
        <form 
            onSubmit={handleSubmit}
            autoComplete="on"
            className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl mx-auto"
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
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput("message")}
                    onBlur={() => setActiveInput(null)}
                    rows={3}
                    placeholder="Your message"
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
                disabled={!isFormReady || isSubmitting}
                className={`lg:col-span-2 py-7 px-10 text-xl flex items-center justify-center
                ${isFormReady && !isSubmitting ? "bg-blue-500 hover:bg-brown cursor-pointer" : "bg-gray-500 cursor-not-allowed"} 
                text-white transition-all duration-300`}
            >
                {isSubmitting ? <MoonLoader size={25} color="#fff" /> : "Send Message"}
            </button>        
        </form>
    );
};

export default ContactForm;
