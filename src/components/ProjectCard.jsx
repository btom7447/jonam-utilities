"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const ProjectCard = ({ data }) => {
    const [timestamp, setTimestamp] = useState("");

    useEffect(() => {
        setTimestamp(`?t=${Date.now()}`);
    }, []);

    return (
        <div className=''>
            <div className='overflow-hidden group relative'>
                {/* {data.images?.[0]?.url && ( */}
                    <Image
                        src={`${data?.images[0].url}${timestamp}`}
                        alt={`${data?.name ?? data?.name} thumbnail`}
                        width={50}
                        height={70}
                        className='w-200 h-100  object-cover transition-transform duration-300 group-hover:scale-120'
                        unoptimized
                    />
                {/* )} */}
            </div>
            <Link href={`/projects/${data._id}`} className='mt-5 block text-2xl font-semibold text-black text-center capitalize hover:text-blue-500'>{data?.name}</Link>
        </div>
    )
}

export default ProjectCard