"use client";

import { resetPassword } from "@/lib/firebase";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";

const ResetModal = ({ setView }) => {
    const [activeInput, setActiveInput] = useState(null);
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const fields = [
        { label: "Email", name: "email", type: "email" },
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email) {
            toast.error("Please fill in all fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error("Please enter a valid email");
            return;
        }
        try {
            setLoading(true);
            await resetPassword(form.email);
            toast.success("Password reset link sent!");
            setView("login");
        } catch (error) {
            toast.error(error.message || "Failed to send link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <p className="text-xl text-center text-gray-700"><strong>Enter the email</strong> that you used when you signed up to recover your password. You will receive a <strong>password reset link</strong>.</p>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                {fields.map(({ label, name, type }) => (
                    <div key={name} className="relative group">
                        <input
                            type={name === "password" && showPassword ? "text" : type}
                            name={name}
                            id={name}
                            placeholder={label}
                            value={form[name]}
                            onChange={handleChange}
                            onFocus={() => setActiveInput(name)}
                            onBlur={() => setActiveInput(null)}
                            className="w-full text-xl py-5 border-b-1 outline-none bg-transparent border-gray-500 text-black transition-all duration-300"
                        />
                        {/* Animated bottom border */}
                        <span
                            className={`absolute left-0 bottom-0 h-0.5 
                            transition-all duration-200
                            ${activeInput === name ? "w-full bg-blue-500" : "w-0 bg-gray-900"} 
                            group-hover:w-full group-hover:bg-blue-500`}
                        ></span>

                        {/* Toggle password visibility */}
                        {name === "password" && (
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center mt-10 mb-10 py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer ${loading ? "opacity-70 cursor-not-allowed": ""} `}
                >
                    {loading ? <MoonLoader size={25} color="#fff" /> : "Send link"}                
                </button>
            </form>
        </section>
    );
};

export default ResetModal;