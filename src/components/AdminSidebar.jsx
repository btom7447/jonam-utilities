"use client";

import logo from "../../public/logo-trans.png";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from 'next/link';
import { logout } from '@/lib/firebase';
import { LogOutIcon } from 'lucide-react';
import { toast } from "react-toastify";

export default function AdminSidebar({ navItems }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("You're logged out!");
        } catch (error) {
            toast.error("Failed to logout. Please try again.");
        }
    };

    return (
        <aside className="adminSidebar w-full h-full bg-gray-900 px-10 py-5 flex flex-col justify-between items-center overflow-y-auto">
            <div className="flex flex-col items-center">
                <Link href="/" className='flex items-center bg-white p-2 rounded-full'>
                    <Image
                        src={logo}
                        alt="Jonam Utilities logo"
                        width={30}
                        height={30}
                        className='w-20 h-20 object-contain'
                        unoptimized
                    />
                </Link>
                <h1 className="mt-3 text-xl text-white font-semibold text-center">
                    Jonam Utilities <br />Admin
                </h1>
            </div>

            <nav className="w-full mt-10">
                <ul className="space-y-5 w-full">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <li key={href} className="relative w-full">
                                <Link
                                    href={href}
                                    className={`w-fit relative flex items-center py-2 text-lg transition-colors duration-300 ${
                                        active ? "text-blue-500 font-semibold" : "text-gray-200 hover:text-blue-500"
                                    }`}
                                >
                                    <Icon size={18} className="mr-3" />
                                    {label}
                                    <span
                                        className={`absolute left-0 -bottom-1 h-0.5 transition-all duration-200 ${
                                        active ? "w-full bg-blue-500" : "w-0 bg-transparent group-hover:w-full group-hover:bg-blue-500"
                                        }`}
                                    ></span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <button
                type="button"
                onClick={handleLogout}
                className='text-2xl flex gap-2 items-center text-white cursor-pointer hover:text-blue-500 mt-10'
            >
                <LogOutIcon size={20} />
                Logout 
            </button>
        </aside>
    );
}
