import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const ProjectCard = ({ data }) => {
    // const [timestamp, setTimestamp] = useState("");

    // useEffect(() => {
    //     setTimestamp(`?t=${Date.now()}`);
    // }, []);
    // <Image
    //     src={`${data.images[0].url}${timestamp}`}
    //     alt={`${data.name ?? data.name} thumbnail`}
    //     width={50}
    //     height={70}
    //     className='w-70 h-80 object-cover transition-transform duration-300 group-hover:scale-120'
    //     unoptimized
    // />
    
    const fallbackImage = "/default-project.jpg"; // Your fallback placeholder

    const imageUrl =
    Array.isArray(data.images) && data.images[0] && data.images[0].length > 0
      ? data.images[0]
      : fallbackImage;

    return (
        <div className=''>
            <div className='overflow-hidden group'>
                {/* {data.images?.[0]?.url && ( */}
                    <Image
                        src={`${imageUrl}`}
                        alt={`${data.name ?? data.name} thumbnail`}
                        width={50}
                        height={70}
                        className='w-full h-120 object-cover transition-transform duration-300 group-hover:scale-120'
                        unoptimized
                    />
                {/* )} */}
            </div>
            <Link href={`/product/${data.recordId}`} className='block text-2xl font-semibold text-black text-center capitalize hover:text-blue-500'>{data.name}</Link>

        </div>
    )
}

export default ProjectCard