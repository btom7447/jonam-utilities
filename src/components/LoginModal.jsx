"use client";

import { MailIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle } from "@/lib/firebase";
import { useRouter } from "next/navigation";


const ADMIN_EMAILS = [
  "admin1@example.com",
  "tomekemini7447@gmail.com",
  "tombenjamin7447@gmail.com", // your email
];

const LoginModal = ({ setView, onClose }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const googleProvider = user.providerData.find(
          (provider) => provider.providerId === "google.com"
        );
        if (googleProvider) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
        } else {
          setCurrentUser(null);
        }
      });
      return () => unsubscribe();
  }, []);

  const redirectUser = (user) => {
    if (!user) return;
    if (ADMIN_EMAILS.includes(user.email)) {
      router.push("/admin"); // admin redirect
    } else {
      router.push("/"); // regular user
    }
    onClose();
  };


  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      setCurrentUser(auth.currentUser); 
      onClose();
    } catch (error) {
      toast.error(error.message || "Google sign-in failed");
    }
      setLoading(false);
    };

  const handleContinueAsUser = () => {
    toast.success(`Welcome back, ${currentUser.displayName}!`);
    // Optionally close modal or redirect here
  };

  return (
    <section>
      <div className="flex flex-col items-center gap-2">
        {currentUser ? (
          <button
            type="button"
            onClick={handleContinueAsUser}
            className="w-full max-w-100 px-10 py-3 flex justify-center items-center gap-3 border border-gray-300 bg-white text-lg text-gray-700 cursor-pointer hover:border-blue-500 hover:text-blue-500"
          >
            {/* Google icon SVG (same as before) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Continue as {currentUser.displayName || currentUser.email}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full max-w-100 px-10 py-3 flex justify-center items-center gap-3 border border-gray-300 bg-white text-lg text-gray-700 cursor-pointer hover:border-blue-500 hover:text-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {/* Google icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Continue with Google
          </button>
        )}

        <button
          type="button"
          onClick={() => setView("email")}
          className="w-full max-w-100 px-10 py-3 flex justify-center items-center gap-3 border border-gray-300 bg-white text-lg text-gray-700 cursor-pointer hover:border-blue-500 hover:text-blue-500"
        >
          <MailIcon size={20} />
          Continue with Email
        </button>
      </div>
      <p className="mt-10 text-center text-lg text-gray-700">
        Don’t have an account?{" "}
        <button
          className="text-blue-500 underline cursor-pointer hover:text-brown"
          onClick={() => setView("signup")}
        >
          Sign Up
        </button>
      </p>
    </section>
  );
};

export default LoginModal;
