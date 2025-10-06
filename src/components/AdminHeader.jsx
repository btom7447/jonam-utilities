"use client";

import logo from "../../public/logo.png";
import { BellIcon } from "lucide-react";
import Image from "next/image";

export default function AdminHeader({ title }) {

    return (
        <header className="bg-transparent py-5 px-5 lg:px-10 flex justify-between items-center">
            <h3 className="text-2xl text-black font-semibold">{title}</h3>
            <div className="flex items-center gap-10">
                <button type="button">
                    <BellIcon size={20} strokeWidth={1} />
                </button>
                <button type="button" className="">
                    <Image src={"/header-logo.png"} alt="profile placeholder" width={30} height={30} className='w-30 h-auto rounded-full object-contain' unoptimized />
                </button>
            </div>
        </header>
    );
}
