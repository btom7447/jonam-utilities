"use client";

import { useRouter } from 'next/navigation';
import { ChevronRight, HeartIcon, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const HandymanCard = ({ data }) => {
    console.log("handy man data", data)
    const router = useRouter();  
    const [timestamp, setTimestamp] = useState("");

    useEffect(() => {
        setTimestamp(`?t=${Date.now()}`);
    }, []);

    if (!data || typeof data !== 'object') return null;

    return (
        <div className='flex flex-col'>
            <div className='w-full flex items-center justify-center bg-white'>
                {data?.image?.[0]?.url && (
                    <Link
                        href={`/handyman/${data?.recordId}`}
                        className='w-full text-2xl font-semibold text-black capitalize hover:text-blue-500'
                    >
                        <Image
                            src={`${data.image[0].url}${timestamp}`}
                            alt={`${data?.caption ?? data?.name ?? "Product"} thumbnail`}
                            width={50}
                            height={70}
                            className='w-full h-120 object-cover'
                            unoptimized
                        />
                    </Link>
                )}

            </div>
            <div className='mt-5 w-full'>
                <Link
                    href={`/handyman/${data?.recordId}`}
                    className='w-full text-2xl font-semibold text-black capitalize hover:text-blue-500'
                >
                    {data?.name ?? "Untitled Product"}
                </Link>

            </div>
        </div>
    );
};

export default HandymanCard;