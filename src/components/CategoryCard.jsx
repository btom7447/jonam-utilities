"use client";

import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const FALLBACK_IMAGE = "/fallback.jpg";

const CategoryCard = ({ data }) => {
    const [timestamp, setTimestamp] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setTimestamp(`?t=${Date.now()}`);
        }
    }, []);

    const originalUrl = data?.images?.[0]?.url;
    const imageUrl = originalUrl ? `${originalUrl}${timestamp}` : FALLBACK_IMAGE;

    return (
        <div className='flex flex-col justify-center items-center group'>
            {imageUrl && (
                <Image 
                    src={imageUrl}
                    alt={`${data.caption || "Category"} thumbnail`} 
                    width={200} height={200} 
                    className='mb-10 w-70 h-70 rounded-full object-cover transition-transform duration-300 group-hover:scale-110' 
                    unoptimized 
                />
            )}
            <h6 className='text-lg font-light text-gray-600 capitalize'>{data.name}</h6>
            <h3 className='my-3 text-2xl lg:text-4xl text-center font-semibold text-black capitalize'>{data.caption}</h3>
            <p className='text-xl text-center text-gray-600'>{data.sub_title}</p>
            <button
                type="button"
                className='mt-5 p-2 flex items-center rounded-full border-1 border-gray-700 bg-white transition-colors duration-300 group-hover:bg-blue-500 group-hover:border-blue-500'
            >
                <ChevronRight size={30} className='text-gray-700 group-hover:text-white cursor-pointer' />
            </button>
        </div>
    );
};

export default CategoryCard;
