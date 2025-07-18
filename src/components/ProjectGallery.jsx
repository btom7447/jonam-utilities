"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ProjectGallery = ({ data }) => {
    const [timestamp, setTimestamp] = useState("");

    useEffect(() => {
        setTimestamp(`?t=${Date.now()}`);
    }, []);

    return (
        <div className=''>
            <div className='grid grid-cols- gap-5'>
                {data?.images?.[0]?.url && (
                    <Image
                        src={`${data.images[0].url}${timestamp}`}
                        alt={`${data?.name ?? data?.name} thumbnail`}
                        width={50}
                        height={70}
                        className='w-150 h-50 lg:h-70 object-cover transition-transform duration-300 group-hover:scale-120'
                        unoptimized
                    />
                )}
                {data?.images?.[1]?.url && (
                    <Image
                        src={`${data.images[1].url}${timestamp}`}
                        alt={`${data?.name ?? data?.name} thumbnail`}
                        width={50}
                        height={70}
                        className='w-150 h-50 lg:h-70 object-cover transition-transform duration-300 group-hover:scale-120'
                        unoptimized
                    />
                )}
                {data?.images?.[1]?.url && (
                    <Image
                        src={`${data.images[1].url}${timestamp}`}
                        alt={`${data?.name ?? data?.name} thumbnail`}
                        width={50}
                        height={70}
                        className='col-span-2 w-300 h-80 lg:h-120 object-cover transition-transform duration-300 group-hover:scale-120'
                        unoptimized
                    />
                )}
            </div>
        </div>
    )
}

export default ProjectGallery