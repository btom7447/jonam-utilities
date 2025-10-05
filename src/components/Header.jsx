"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeaderIcons from './HeaderIcons';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import HamburgerMenu from './HamburgerMenu';
import Image from 'next/image';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`bg-white w-full flex items-center justify-between py-3 px-5 lg:px-20 fixed -top-3.5 left-0 transition-all duration-300 ${isScrolled ? "shadow-md" : "bg-transparent"}`} style={{ zIndex: 1000}}>
            <Link href="/" className='flex items-center' >
                <Image src={"/header-logo.png"} alt="Jonam Utilties logo" width={80} height={30} className='w-30 h-auto xl:w-40 xl:h-auto object-cover' unoptimized />
            </Link>
            <nav className='hidden xl:flex space-x-10 '>
                <Link href="/" className={`relative text-2xl hover:text-blue-500 transition-colors duration-300 ${pathname === "/" ? "text-blue-500" : "text-black"} `}>
                    Home
                    <span
                        className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
                            pathname === "/" ? "w-full bg-blue-500" : "w-0 bg-black/0"
                        }`}
                    ></span>
                </Link>
                <Link href="/about" className={`relative text-2xl hover:text-blue-500 transition-colors duration-300 capitalize ${pathname === "/about" ? "text-blue-500" : "text-black"} `}>
                    About
                    <span
                        className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
                            pathname === "/about" ? "w-full bg-blue-500" : "w-0 bg-black/0"
                        }`}
                    ></span>
                </Link>
                <span
                    className={`relative text-2xl cursor-pointer transition-colors duration-300 ${
                        ["/handyman", "/our-services", "/projects", "/request-quote"].includes(pathname)
                            ? "text-blue-500"
                            : "text-black"
                    }`}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    Solutions
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                ref={dropdownRef}
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className='absolute top-17 left-0 mt-3 w-65 p-7 bg-gray-900 z-50 flex flex-col space-y-7'
                            >
                                <Link href="/handyman" className={`group text-2xl hover:text-white transition-all duration-300 inline-block relative ${pathname === "/handyman" ? "text-blue-500" : "text-gray-300"}`}>
                                    <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                                        Handy Man
                                        <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                        
                                    </span>
                                </Link>
                                <Link href="/our-services" className={`group text-2xl hover:text-white transition-all duration-300 inline-block relative ${pathname === "/our-services" ? "text-blue-500" : "text-gray-300"}`}>
                                    <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                                        Our Services
                                        <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                </Link>
                                <Link href="/projects" className={`group text-2xl hover:text-white transition-all duration-300 inline-block relative ${pathname === "/projects" ? "text-blue-500" : "text-gray-300"}`}>
                                    <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                                        Projects
                                        <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                </Link>
                                <Link href="/request-quote" className={`group text-2xl hover:text-white transition-all duration-300 inline-block relative ${pathname === "/request-quote" ? "text-blue-500" : "text-gray-300"}`}>
                                    <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                                        Request Quote
                                        <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span
                        className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
                            ["/handyman", "/our-services", "/projects", "/request-quote"].includes(pathname)
                                ? "w-full bg-blue-500"
                                : "w-0 bg-black/0"
                        }`}
                    ></span>
                </span>

                <Link
                    href="/shop"
                    className={`relative text-2xl hover:text-blue-500 transition-colors duration-300 capitalize ${
                        pathname === "/shop" || pathname.startsWith("/product")
                        ? "text-blue-500"
                        : "text-black"
                    }`}
                >
                    Shop
                    <span
                        className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
                        pathname === "/shop" || pathname.startsWith("/product")
                            ? "w-full bg-blue-500"
                            : "w-0 bg-black/0"
                        }`}
                    ></span>
                </Link>

                <Link href="/contact" className={`relative text-2xl hover:text-blue-500 transition-colors duration-300 capitalize ${pathname === "/contact" ? "text-blue-500" : "text-black"} `}>
                    Contact
                    <span
                        className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
                            pathname === "/contact" ? "w-full bg-blue-500" : "w-0 bg-black/0"
                        }`}
                    ></span>
                </Link>
            </nav>
                <HeaderIcons hamburgerIsOpen={setIsOpen} />
            <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}

export default Header