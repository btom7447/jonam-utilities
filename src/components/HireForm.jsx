"use client";

import React, { useState } from "react";

const HireForm = () => {
    const [activeInput, setActiveInput] = useState(null);

    const fields = [
        { label: "Name", name: "name", type: "text" },
        { label: "Phone", name: "phone", type: "tel" },
        { label: "Email", name: "email", type: "email" },
    ];

    return (
        <form className="w-full grid grid-cols-1 gap-10 max-w-4xl mx-auto">
            <h3 className="text-5xl text-black font-semibold">Hire Form</h3>
            <p className="-mt-7 text-gray-700 text-xl">Provide details to get started on your project</p>
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

            {/* Message - full span */}
            <div className="relative group">
                <textarea
                    name="message"
                    id="message"
                    placeholder="Give us more details of your need"
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
            <button type="submit" className="py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer">Hire Handyman</button>
        </form>
    );
};

export default HireForm;