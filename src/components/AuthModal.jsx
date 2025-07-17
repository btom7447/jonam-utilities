"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, XIcon } from "lucide-react";
import SignupModal from "./SignupModal";
import ResetModal from "./ResetModal";
import EmailModal from "./EmailModal";
import LoginModal from "./LoginModal";
import Image from "next/image";
import authImage from "../../public/auth-image.jpg";

const AuthModal = ({ onClose, back }) => {
    const [view, setView] = useState("login");
    const [history, setHistory] = useState([]);

    const changeView = (newView) => {
        // Add current view to history before changing
        setHistory((prev) => [...prev, view]);
        setView(newView);
    };

    const goBack = () => {
        if (history.length > 0) {
            const previous = history[history.length - 1];
            setHistory((prev) => prev.slice(0, -1));
            setView(previous);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 z-[999] flex justify-center items-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="relative bg-white w-full max-w-[100dvw] lg:max-w-[92%] xl:max-w-[70%] h-[100dvh] lg:h-[55%] xl:h-[80%] grid grid-cols-1 md:grid-cols-2 shadow-md"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                >
                    {/* Left Image */}
                    <div className="relative h-60 lg:h-full w-full overflow-hidden">
                        <Image
                            src={authImage}
                            alt="Fancy restroom"
                            fill
                            priority
                            className="object-cover object-center"
                        />
                    </div>

                    {/* Right Modal Section */}
                    <div className="px-10 py-10 flex flex-col justify-center overflow-y-scroll authModal relative">
                        {/* Back Button - Hidden on login */}
                        <div className={`flex items-center justify-between mb-10 ${view === "login" ? "flex-row-reverse" : ""}`}>
                            {view !== "login" && (
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="text-blue-500 hover:text-brown text-xl flex items-center cursor-pointer"
                                >
                                    <ChevronLeft size={20} />
                                    Back
                                </button>
                            )}

                            <button
                                type="button"
                                className="cursor-pointer text-black hover:text-gray-700"
                                onClick={() => {
                                    if (back === true && typeof window !== "undefined") {
                                        window.history.back();
                                    }
                                    onClose && onClose();
                                }}
                            >
                                <XIcon size={20} />
                            </button>
                        </div>

                        <h5 className="text-center text-2xl text-gray-700 mb-8">
                            {{
                                login: "Log in",
                                signup: "Sign up",
                                email: "Continue with Email",
                                reset: "Recover your password",
                            }[view]}
                        </h5>

                        {view === "login" && <LoginModal setView={changeView} onClose={onClose} />}
                        {view === "email" && <EmailModal setView={changeView} onClose={onClose} />}
                        {view === "signup" && <SignupModal setView={changeView} onClose={onClose} />}
                        {view === "reset" && <ResetModal setView={changeView} />}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal;
