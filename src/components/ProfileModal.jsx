import { LogOutIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { logout } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const ProfileModal = ({ closeModal }) => {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("You're logged out!");
            closeModal(true);
        } catch (error) {
            toast.error("Failed to logout. Please try again.");
        }
    };

    return (
        <div className="pt-15 lg:pt-5 space-y-7 flex flex-col justify-center lg:justify-start items-center lg:items-start w-full shadow-lg text-white">
            <Link href="/profile" className={`group text-2xl hover:text-white transition-all duration-300 inline-block relative ${pathname === "/profile" ? "text-blue-500" : "text-gray-300"}`}>
                <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                    Profile
                    <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </span>
            </Link>
            <Link href="/orders" className={`group text-2xl hover:text-white transition-all duration-300 inline-block relative ${pathname === "/orders" ? "text-blue-500" : "text-gray-300"}`}>
                <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                    Orders
                    <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </span>
            </Link>
            <Link href="/bookings" className={`group text-2xl hover:text-white transition-all duration-300 inline-block relative ${pathname === "/bookings" ? "text-blue-500" : "text-gray-300"}`}>
                <span className="inline-block group-hover:translate-x-4 transition-transform duration-200">
                    bookings
                    <span className="block h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </span>
            </Link>
            <button type="button" onClick={handleLogout} className='text-2xl flex gap-2 items-center cursor-pointer hover:text-blue-500'>
                <LogOutIcon size={20} />
                Logout 
            </button>
        </div>
    )
}

export default ProfileModal