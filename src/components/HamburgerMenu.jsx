"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const HamburgerMenu = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);

  const handleToggleSolutions = () => {
    setIsSolutionsOpen(!isSolutionsOpen);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 md:hidden`}
    >
      {/* Close Button */}
      <button
        className="absolute top-10 right-5"
        onClick={() => setIsOpen(false)}
      >
        <X size={28} />
      </button>

      {/* Mobile Navigation Links */}
      <nav className="flex flex-col items-center mt-30 space-y-10">
        <Link
          href="/"
          className={`relative text-xl text-black hover:text-brown transition-colors duration-300 ${
            pathname === "/" ? "text-brown" : "text-black"
          }`}
          onClick={() => setIsOpen(false)}
        >
          Home
          <span
            className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
              pathname === "/" ? "w-full bg-brown" : "w-0 bg-black/0"
            }`}
          ></span>
        </Link>
        <Link
          href="/about"
          className={`relative text-xl text-black hover:text-brown transition-colors duration-300 ${
            pathname === "/about" ? "text-brown" : "text-black"
          }`}
          onClick={() => setIsOpen(false)}
        >
          About
          <span
            className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
              pathname === "/about" ? "w-full bg-brown" : "w-0 bg-black/0"
            }`}
          ></span>
        </Link>
        <Link
          href="/shop"
          className={`relative text-xl text-black hover:text-brown transition-colors duration-300 ${
            pathname === "/shop" ? "text-brown" : "text-black"
          }`}
          onClick={() => setIsOpen(false)}
        >
          Shop
          <span
            className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
              pathname === "/shop" ? "w-full bg-brown" : "w-0 bg-black/0"
            }`}
          ></span>
        </Link>
        <Link
          href="/contact"
          className={`relative text-xl text-black hover:text-brown transition-colors duration-300 ${
            pathname === "/contact" ? "text-brown" : "text-black"
          }`}
          onClick={() => setIsOpen(false)}
        >
          Contact
          <span
            className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
              pathname === "/contact" ? "w-full bg-brown" : "w-0 bg-black/0"
            }`}
          ></span>
        </Link>

        {/* Accordion for Solutions */}
        <div className="relative text-xl">
          <button
            className="flex items-center justify-between w-full text-black hover:text-brown transition-colors duration-300"
            onClick={handleToggleSolutions}
          >
            Solutions
            <span
              className={`transform transition-transform duration-300 ${
                isSolutionsOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
          {isSolutionsOpen && (
            <div className="flex flex-col space-y-5 mt-3">
              <Link
                href="/our-services"
                className="text-xl text-black hover:text-brown transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Our Services
              </Link>
              <Link
                href="/handyman"
                className="text-xl text-black hover:text-brown transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Handyman
              </Link>
              <Link
                href="/request-quote"
                className="text-xl text-black hover:text-brown transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Request Quote
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default HamburgerMenu;
