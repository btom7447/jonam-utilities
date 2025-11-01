"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import {  Mail, SendHorizonal, } from 'lucide-react';
import { toast } from 'react-toastify';
import { MoonLoader } from 'react-spinners';


const Footer = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ email: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

     const handleSubmit = async (e) => {
       e.preventDefault();
       setIsSubmitting(true);

       const payload = { email_address: formData.email };

       try {
         const res = await fetch("/api/newsletter", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(payload),
         });

         const result = await res.json();

         if (res.ok) {
           toast.success("You've joined the newsletter!");
           setFormData({ email: "" });
         } else if (res.status === 400 && result.message) {
           // Friendly message for existing subscriber
           toast.info("You're already part of the newsletter!");
         } else {
           console.error(result.error);
           toast.error("Unable to join newsletter");
         }
       } catch (error) {
         console.error("Newsletter error:", error);
         toast.error("Something went wrong");
       } finally {
         setIsSubmitting(false);
       }
     };
        
    const currentYear = new Date().getFullYear();
    return (
      <footer className="flex-col">
        <div className="px-10 lg:p-20 bg-gray-900 ">
          <div className="py-10 grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-5 items-start">
            <Link
              href="/"
              className="flex items-center md:col-span-2 xl:col-span-1"
            >
              <Image
                src={"/footer-logo.png"}
                alt="Jonam Utilties logo"
                width={80}
                height={30}
                className="w-30 h-auto xl:w-60 xl:h-auto object-cover"
                unoptimized
              />
            </Link>
            <div className="flex-col col-span-1">
              <h6 className="text-3xl font-semibold text-white capitalize mb-7">
                Office
              </h6>
              <p className="text-xl lg:text-2xl font-light text-gray-200 mb-5">
                Ile Ife, Osun State, Nigeria
              </p>
              <a
                className="text-xl lg:text-2xl font-light text-gray-200 mb-5 border-b-1 border-white hover:text-blue-500"
                href="mailto:info@jonam.ng"
              >
                info@jonam.ng
              </a>
              <br />
              <br />
              <a
                className="block text-xl lg:text-2xl font-light text-gray-200 hover:text-blue-500 mb-5"
                href="tel:+2348060779377"
              >
                +234 806 077 9377
              </a>
              <a
                className="block text-xl lg:text-2xl font-light text-gray-200 hover:text-blue-500"
                href="tel:+2347033934861"
              >
                +234 703 393 4861
              </a>
            </div>
            <div className="flex-col col-span-1 xl:ml-20">
              <h6 className="text-3xl font-semibold text-white capitalize mb-7">
                Links
              </h6>
              <ul className="list-none flex-col items-start space-y-5">
                <li>
                  <Link
                    href="/"
                    className="text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-services"
                    className="text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-1 md:col-span-2 flex-col ">
              <h6 className="text-3xl font-semibold text-white capitalize mb-7">
                Newsletter
              </h6>
              <form
                onSubmit={handleSubmit}
                autoComplete="on"
                className="flex items-center justify-stretch border-b-1 border-gray-700"
              >
                <div className="w-13 h-5">
                  <Mail
                    size={25}
                    color="#fff"
                    strokeWidth={2}
                    className="mr-5"
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email Address"
                  className="flex-1 h-12 bg-transparent outline-0 text-xl text-white placeholder:text-white border-none outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="p-5 cursor-pointer flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <MoonLoader size={20} color="#fff" />
                  ) : (
                    <SendHorizonal size={25} color="#fff" />
                  )}
                </button>
              </form>
            </div>
          </div>
          <hr className="hidden lg:block lg:mt-20 w-full border-t-1 border-gray-700 " />
          <div className="py-15 flex flex-wrap gap-10 justify-center lg:justify-between items-center">
            <p className="text-white text-md">
              Jonam Utilities &copy; {currentYear}. All Rights Reserverd.
            </p>
            <a
              href="https://kmini-tech.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm lg:text-md text-white hover:text-blue-500"
            >
              By Kmini Technologies
            </a>
          </div>
        </div>
      </footer>
    );
}

export default Footer