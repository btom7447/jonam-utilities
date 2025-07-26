"use client";

import { Star } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import HireForm from './HireForm';

const HandymanProfile = ({ data }) => {
    const [timestamp, setTimestamp] = useState("");
    
        useEffect(() => {
            setTimestamp(`?t=${Date.now()}`);
        }, []);

    return (
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20'>
            <div>
                <Image
                    src={`${data.image[0].url}${timestamp}`}
                    alt={`${data?.name} Handyman`}
                    width={50}
                    height={70}
                    className='w-full h-100 md:h-160 object-cover object-top'
                    unoptimized
                />            
            </div>
            <div>
                <h5 className='text-xl text-black font-semibold'>Plumber</h5>
                <h2 className='text-3xl md:text-5xl text-black font-semibold'>{data?.name}</h2>
                { data?.availability && (
                    <h6 className={`mt-5 w-fit px-7 py-3 text-white uppercase ${
                            data?.availability === "available" ? "bg-blue-500" : 
                            data?.availability === "away" ? "bg-gray-700" : 
                            data?.availability === "booked" ? "bg-brown" : ""
                        }`}>
                        {data?.availability}
                    </h6>
                )}
                <p className='my-10 text-2xl text-gray-700 font-light leading-loose'>
                    {data?.profile}
                </p>
                <div className="mt-5 mb-15 flex gap-1 text-yellow-500 text-xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={20}
                            className="text-yellow-500"
                            fill={i < data?.rating ? 'currentColor' : 'none'} 
                        />
                    ))}
                </div>
                <HireForm data={data} />
            </div>
        </section>
    )
}

export default HandymanProfile;