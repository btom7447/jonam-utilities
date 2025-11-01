"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { registerWithEmail, auth } from "@/lib/firebase";
import { loadOrCreateUserProfile } from "@/lib/firestoreUser";
import { updateProfile } from "firebase/auth";

const SignupModal = ({ setView, onClose }) => {
  const [activeInput, setActiveInput] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Register user with Firebase Auth
      const userCredential = await registerWithEmail(email, password);
      const user = userCredential.user;

      // Determine role
      const role = email.toLowerCase().endsWith("@jonam.ng") ? "staff" : "user";

      // Update Firebase Auth profile (so displayName shows in UI)
      await updateProfile(user, {
        displayName: name,
      });

      // Create / Update Firestore user record with role
      await loadOrCreateUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: user.photoURL || "",
        role,
      });

      // Add custom claim (optional advanced feature for server-side role validation)
      // You can use this later in Firebase Admin SDK if you want to secure routes

      toast.success(`Welcome, ${name}!`);
      onClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="relative group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            onFocus={() => setActiveInput("name")}
            onBlur={() => setActiveInput(null)}
            className="w-full text-xl py-5 border-b-1 outline-none bg-transparent border-gray-500 text-black transition-all duration-300"
          />
          <span
            className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
              activeInput === "name" ? "w-full bg-blue-500" : "w-0 bg-gray-900"
            } group-hover:w-full group-hover:bg-blue-500`}
          ></span>
        </div>

        {/* Email */}
        <div className="relative group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onFocus={() => setActiveInput("email")}
            onBlur={() => setActiveInput(null)}
            className="w-full text-xl py-5 border-b-1 outline-none bg-transparent border-gray-500 text-black transition-all duration-300"
          />
          <span
            className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
              activeInput === "email" ? "w-full bg-blue-500" : "w-0 bg-gray-900"
            } group-hover:w-full group-hover:bg-blue-500`}
          ></span>
        </div>

        {/* Password */}
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onFocus={() => setActiveInput("password")}
            onBlur={() => setActiveInput(null)}
            className="w-full text-xl py-5 border-b-1 outline-none bg-transparent border-gray-500 text-black transition-all duration-300 pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
          <span
            className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
              activeInput === "password"
                ? "w-full bg-blue-500"
                : "w-0 bg-gray-900"
            } group-hover:w-full group-hover:bg-blue-500`}
          ></span>
        </div>

        {/* Confirm Password */}
        <div className="relative group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            onFocus={() => setActiveInput("confirmPassword")}
            onBlur={() => setActiveInput(null)}
            className="w-full text-xl py-5 border-b-1 outline-none bg-transparent border-gray-500 text-black transition-all duration-300 pr-10"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
          <span
            className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
              activeInput === "confirmPassword"
                ? "w-full bg-blue-500"
                : "w-0 bg-gray-900"
            } group-hover:w-full group-hover:bg-blue-500`}
          ></span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center mt-10 py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? <MoonLoader size={25} color="#fff" /> : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-center text-md">
        Already have an account?{" "}
        <button
          className="text-blue-500 underline hover:text-brown cursor-pointer"
          onClick={() => setView("login")}
        >
          Log in
        </button>
      </p>
    </section>
  );
};

export default SignupModal;
