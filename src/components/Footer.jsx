"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import logo from "../../public/logo-trans.png";
import { ChevronRight, FacebookIcon, Inbox, InstagramIcon, LinkedinIcon, Mail, TwitterIcon, XIcon } from 'lucide-react';


const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className='flex-col'>
            {/* <div className='w-full flex flex-row items-center justify-center bg-white'>
                <div className='flex-1/4 py-7 flex flex-row justify-center items-center gap-3 border-r-1 border-gray-500 cursor-pointer group'>
                    <FacebookIcon size={20} className='text-gray-900 group-hover:text-blue-500' />
                    <a href='' className='hidden lg:block text-xl group-hover:text-blue-500'>Facebook</a>
                </div>
                <div className='flex-1/4 py-7 flex flex-row justify-center items-center gap-3 border-r-1 border-gray-500 cursor-pointer group'>
                    <InstagramIcon size={20} className='text-gray-900 group-hover:text-blue-500' />
                    <a href='' className='hidden lg:block text-xl group-hover:text-blue-500'>Instagram</a>
                </div>
                <div className='flex-1/4 py-7 flex flex-row justify-center items-center gap-3 border-r-1 border-gray-500 cursor-pointer group'>
                    <TwitterIcon size={20} className='text-gray-900 group-hover:text-blue-500' />
                    <a href='' className='hidden lg:block text-xl group-hover:text-blue-500'>Twitter</a>
                </div>
                <div className='flex-1/4 py-7 flex flex-row justify-center items-center gap-3 cursor-pointer group'>
                    <LinkedinIcon size={20} className='text-gray-900 group-hover:text-blue-500' />
                    <a href='' className='hidden lg:block text-xl group-hover:text-blue-500'>LinkedIn</a>
                </div>
            </div> */}
            <div className='px-10 lg:p-20 bg-gray-900 '>
                <div className='py-10 grid gap-10 grid-cols-1 lg:grid-col-2 xl:grid-cols-5 items-start'>
                    <Link href="/request-quote" className='flex items-center' >
                        <Image src={logo} alt="Jonam Utilties logo" width={80} height={30} className='w-30 h-auto xl:w-40 xl:h-auto object-cover' unoptimized />
                    </Link>
                    <div className='flex-col '>
                        <h6 className='text-3xl font-semibold text-white capitalize mb-7'>Office</h6>
                        <p className='text-xl lg:text-2xl font-light text-gray-200 mb-3'>Ile Ife, Osun State, Nigeria</p>
                        <a className='text-xl lg:text-2xl font-light text-gray-200 mb-3 border-b-1 border-white hover:text-blue-500' href="mailto:info@example.com">info@example.com</a><br /><br />
                        <a className='text-xl lg:text-2xl font-light text-gray-200 hover:text-blue-500' href="tel:+2349155674236">+2349155674236</a>
                    </div>
                    <div className='flex-col '>
                        <h6 className='text-3xl font-semibold text-white capitalize mb-7'>Links</h6>
                        <ul className='list-none flex-col items-start space-y-5'>
                            <li>
                                <Link href='/' className='text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500'>Home</Link>
                            </li>
                            <li>
                                <Link href="/our-services" className='text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500'>Services</Link>
                            </li>
                            <li>
                                <Link href="/about" className='text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500'>About Us</Link>
                            </li>
                            <li>
                                <Link href="/shop" className='text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500'>Shop</Link>
                            </li>
                            <li>
                                <Link href="/contact" className='text-xl lg:text-2xl font-light text-gray-200 mb-3 hover:text-blue-500'>Contact</Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col-span-1 xl:col-span-2 flex-col '>
                        <h6 className='text-3xl font-semibold text-white capitalize mb-7'>Newsletter</h6>
                        <div className='flex items-center justify-stretch border-b-1 border-gray-700'>
                            <Mail size={25} color='#fff' strokeWidth={2} className='mr-5' />
                            <input type='email' placeholder='Enter Your Email Address' className='px-3 flex-1 h-19 text-2xl text-white placeholder-shown:text-white border-0 outline-0' />
                            <button type='submit' className='p-5'>
                                <ChevronRight size={25} color='#fff' />
                            </button>
                        </div>
                    </div>
                </div>
                <hr className='w-full border-t-1 border-gray-700 ' />
                <div className='py-10 flex flex-wrap justify-between items-center'>
                    <p className='text-white text-md'>Jonam Utilities &copy; {currentYear}. All Rights Reserverd.</p>
                    <p className='text-white text-md'>By Kmini Technologies</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer