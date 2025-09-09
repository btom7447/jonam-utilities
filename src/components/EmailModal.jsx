"use client";

import { loginWithEmail } from "@/lib/firebase";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = [
  "jonamengr@gmail.com",
  "Joshuaobasi236@gmail.com",
  "tomekemini7447@gmail.com",
  "tombenjamin7447@gmail.com", // your email
];

const EmailModal = ({ setView, onClose }) => {
  const [activeInput, setActiveInput] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fields = [
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
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
      const user = await loginWithEmail(form.email, form.password);
      toast.success("Logged in successfully!");

      // redirect depending on email
      if (ADMIN_EMAILS.includes(user?.email)) {
        router.push("/admin");
      } else {
        router.push("/");
      }

      onClose();
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
};


  return (
    <section>
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

        <div className="flex items-center space-x-2 mt-2 ">
          <input
            type="checkbox"
            id="stayLoggedIn"
            name="stayLoggedIn"
            checked={form.stayLoggedIn || false}
            onChange={e => setForm({ ...form, stayLoggedIn: e.target.checked })}
            className="w-6 h-6 cursor-pointer"
          />
          <label htmlFor="stayLoggedIn" className="text-gray-700 text-lg cursor-pointer">
            Stay logged in
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center mt-10 mb-10 py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer ${loading ? "opacity-70 cursor-not-allowed": ""} `}
        >
          {loading ? <MoonLoader size={25} color="#fff" /> : "Sign up"}                
        </button>
      </form>
      <button className="mb-5 w-full text-center text-blue-500 hover:text-brown cursor-pointer" onClick={() => setView("reset")}>
        I forgot my password
      </button>
      <p className=" text-center text-md ">
        Don’t have an account?{" "}
        <button className="text-blue-500 underline hover:text-brown cursor-pointer" onClick={() => setView("signup")}>
          Sign Up
        </button>
      </p>
    </section>
  );
};

export default EmailModal;
