"use client";

import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import DatePickerDropdown from "./DatePickerDropdown";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const serviceOptions = ["installation", "maintenance", "repair", "upgrade"];

const HireForm = ({ data }) => {
  const [user, setUser] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [activeServiceDropdown, setActiveServiceDropdown] = useState(false);
  const [activeDatePicker, setActiveDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    address: "",
  });

  // ✅ Detect Auth and Pre-fill email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData((prev) => ({
          ...prev,
          email: currentUser.email || "",
        }));
      } else {
        setUser(null);
        setFormData((prev) => ({ ...prev, email: "" }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" && user) return; // prevent editing if logged in
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    toast.info("Please log in to book a handyman.");
    return;
  }

  setIsSubmitting(true);

  const payload = {
    handyman: data._id, // ✅ MongoDB ObjectId
    handyman_name: data.name,
    handyman_image: data.image?.[0]?.url || "",
    customer_name: formData.name,
    customer_email: formData.email,
    customer_number: formData.phone,
    customer_address: formData.address,
    service_type: selectedService,
    booking_date: selectedDate,
    additional_notes: formData.message,
  };

  try {
    const res = await fetch("/api/book-handyman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok) {
      toast.success("Booking created successfully!");
      setFormData({
        name: "",
        phone: "",
        email: user.email || "",
        message: "",
        address: "",
      });
      setSelectedDate(null);
      setSelectedService("");
    } else {
      console.error(result.error);
      toast.error("Failed to create booking");
    }
  } catch (error) {
    console.error("Booking error:", error);
    toast.error("Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};


  const fields = [
    { label: "Name", name: "name", type: "text", autoComplete: "name" },
    { label: "Phone", name: "phone", type: "tel", autoComplete: "tel" },
    {
      label: "Email",
      name: "email",
      type: "email",
      autoComplete: "email",
      readOnly: !!user,
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      autoComplete: "street-address",
    },
  ];

  const isFormReady =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    formData.address?.trim() &&
    selectedService.trim() &&
    selectedDate;

  // 🚫 If no user, show login message
  if (!user) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <p className="text-gray-600 text-2xl text-center max-w-md">
          Please log in to continue your booking.
        </p>
        <p className="text-gray-500 mt-2">
          You need an account to book a handyman.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="on"
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl mx-auto"
    >
      <div className="lg:col-span-2">
        <h3 className="text-5xl text-black font-semibold">Hire Form</h3>
        <p className="text-gray-700 text-xl">
          Provide details to get started on your project
        </p>
      </div>

      {fields.map(({ label, name, type, autoComplete, readOnly }) => (
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
            readOnly={readOnly}
            className={`w-full text-xl py-5 border-b-1 outline-none bg-transparent border-gray-500 text-black transition-all duration-300 ${
              readOnly ? "cursor-not-allowed text-gray-500" : ""
            }`}
          />
          <span
            className={`absolute left-0 bottom-0 h-0.5 
                transition-all duration-200
                ${
                  activeInput === name
                    ? "w-full bg-blue-500"
                    : "w-0 bg-gray-900"
                } 
                group-hover:w-full group-hover:bg-blue-500`}
          ></span>
        </div>
      ))}

      {/* Custom Service Dropdown */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => setActiveServiceDropdown(!activeServiceDropdown)}
          className={`w-full flex justify-between items-center py-5 border-b-1 border-gray-500 text-xl bg-transparent cursor-pointer ${
            selectedService ? "text-black" : "text-gray-500"
          }`}
        >
          {selectedService || "Select a Service"}
          <ChevronDown size={20} />
        </button>

        {activeServiceDropdown && (
          <ul className="absolute z-10 w-full max-h-80 overflow-y-auto bg-gray-900 border border-gray-900 mt-2">
            {serviceOptions.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setSelectedService(option);
                  setActiveInput(null);
                  setActiveServiceDropdown(false);
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
      </div>

      {/* Date Picker */}
      <div className="relative group">
        <DatePickerDropdown
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
          activeInput={activeDatePicker}
          setActiveInput={setActiveDatePicker}
        />
      </div>

      {/* Message */}
      <div className="relative group lg:col-span-2">
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          onFocus={() => setActiveInput("message")}
          onBlur={() => setActiveInput(null)}
          placeholder="Give us additional notes"
          rows={3}
          className="w-full text-xl py-5 border-b-1 outline-none bg-transparent resize-none border-gray-500 text-black transition-all duration-300"
        />
        <span
          className={`absolute left-0 bottom-1.5 h-0.5 
              transition-all duration-200 
              ${
                activeInput === "message"
                  ? "w-full bg-blue-500"
                  : "w-0 bg-gray-700"
              } 
              group-hover:w-full group-hover:bg-blue-500`}
        ></span>
      </div>

      <button
        type="submit"
        disabled={!isFormReady || isSubmitting}
        className={`lg:col-span-2 py-7 px-10 text-xl flex items-center justify-center
            ${
              isFormReady && !isSubmitting
                ? "bg-blue-500 hover:bg-brown cursor-pointer"
                : "bg-gray-500 cursor-not-allowed"
            } 
            text-white transition-all duration-300`}
      >
        {isSubmitting ? <MoonLoader size={25} color="#fff" /> : "Book Handyman"}
      </button>
    </form>
  );
};

export default HireForm;
