"use client"

// import Image from 'next/image';
import { useEffect, useState } from 'react';
import logo from "../../public/logo-trans.png";
import Link from 'next/link';
import HeaderIcons from './HeaderIcons';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { Menu } from 'lucide-react';
import HamburgerMenu from './HamburgerMenu';
import Image from 'next/image';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`bg-white w-full flex items-center justify-between py-5 px-5 md:px-20 fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : "bg-transparent"}`}>
            <Link href="/" className='flex items-center' >
                <Image src={logo} alt="Jonam Utilties logo" width={80} height={30} className='w-30 h-auto xl:w-40 xl:h-auto object-cover' unoptimized />
            </Link>
            <nav className='hidden lg:flex space-x-10 '>
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
                    className='relative text-2xl text-black cursor-pointer'
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
                                <Link href="/our-services" className="group text-2xl text-gray-300 hover:text-white transition-all duration-300 inline-block relative">
                                    <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                                        Our Services
                                        <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                </Link>
                                <Link href="/handyman" className="group text-2xl text-gray-300 hover:text-white transition-all duration-300 inline-block relative">
                                    <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                                        Handy Man
                                        <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                </Link>
                                <Link href="/request-quote" className="group text-2xl text-gray-300 hover:text-white transition-all duration-300 inline-block relative">
                                    <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                                        Request Quote
                                        <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </span>

                <Link href="/shop" className={`relative text-2xl hover:text-blue-500 transition-colors duration-300 capitalize ${pathname === "/shop" ? "text-blue-500" : "text-black"} `}>
                    Shop
                    <span
                        className={`absolute left-0 -bottom-2 h-0.5 transition-all duration-200 ${
                            pathname === "/shop" ? "w-full bg-blue-500" : "w-0 bg-black/0"
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
            <HeaderIcons />

            <button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)}>
                <Menu size={28} />
            </button>
            <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}

export default Header