"use client";

import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const HamburgerMenu = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  // Load saved accordion state from localStorage on mount
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("solutionsAccordionOpen") === "true";
    }
    return false;
  });

  // Save accordion state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("solutionsAccordionOpen", isSolutionsOpen);
    }
  }, [isSolutionsOpen]);

  const handleToggleSolutions = () => setIsSolutionsOpen((open) => !open);

  return (
    <>
      {/* Overlay & menu container */}
      <div
        className={`cartItem fixed top-0 right-0 h-[100dvh] w-[100dvw] bg-gray-900 shadow-xl z-50 px-8 py-10 md:hidden
          transform transition-transform duration-500 ease-in-out overflow-y-auto
          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[100%] pointer-events-none"}`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 text-gray-500 hover:text-white"
          aria-label="Close menu"
        >
          <X size={30} />
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col items-center gap-10 mt-30 text-xl font-light">
          <Link
            href="/"
            className={`relative ${pathname === "/" ? "text-blue-500" : "text-white"}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={`relative ${pathname === "/about" ? "text-blue-500" : "text-white"}`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          {/* Accordion for Solutions */}
          <div className="w-full">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleSolutions();
              }}
              className="flex items-center gap-3 justify-center w-full text-white"
              aria-expanded={isSolutionsOpen}
              aria-controls="solutions-accordion"
            >
              <span>Solutions</span>
              <span
                className={`transform transition-transform duration-300 ${
                  isSolutionsOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <ChevronDown size={20} />
              </span>
            </button>
            <div
              id="solutions-accordion"
              className={`overflow-hidden flex flex-col items-center gap-10
                transition-[max-height,opacity,visibility] duration-500 ease-in-out
                ${
                  isSolutionsOpen
                    ? "max-h-[500px] opacity-100 visible mt-10"
                    : "max-h-0 opacity-0 invisible mt-0"
                }`}
              style={{ willChange: "max-height, opacity, visibility" }}
            >
              <Link
                href="/our-services"
                onClick={() => setIsOpen(false)}
                className={`relative ${
                  pathname === "/our-services" ? "text-blue-500" : "text-gray-400"
                }`}
              >
                Our Services
              </Link>
              <Link
                href="/handyman"
                onClick={() => setIsOpen(false)}
                className={`relative ${
                  pathname === "/handyman" ? "text-blue-500" : "text-gray-400"
                }`}
              >
                Handyman
              </Link>
              <Link
                href="/request-quote"
                onClick={() => setIsOpen(false)}
                className={`relative ${
                  pathname === "/request-quote" ? "text-blue-500" : "text-gray-400"
                }`}
              >
                Request Quote
              </Link>
            </div>
          </div>

          <Link
            href="/shop"
            className={`relative ${pathname === "/shop" ? "text-blue-500" : "text-white"}`}
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/contact"
            className={`relative ${pathname === "/contact" ? "text-blue-500" : "text-white"}`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
