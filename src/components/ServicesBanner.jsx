import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import aboutPosterOne from "../../public/service-banner-two.jpg";
import aboutPosterTwo from "../../public/service-banner.png";

const ServicesBanner = () => {
    return (
        <section className='flex flex-wrap xl:flex-nowrap gap-5 xl:gap-20 px-5 md:px-20 py-20 items-center'>
            <div className='w-full xl:w-1/2 h-100 xl:h-150'>
                <div className='relative w-full h-full'>
                    <Image
                        src={aboutPosterOne}
                        alt='service poster one'
                        width={200}
                        height={400}
                        className='object-cover w-[70%] h-[70%] absolute top-0 left-0'
                        unoptimized
                    />
                    <Image
                        src={aboutPosterTwo}
                        alt='service poster two'
                        width={200}
                        height={400}
                        className=' object-cover w-[55%] h-[80%] absolute bottom-0 right-0 z-10'
                        unoptimized
                    />
                </div>
            </div>

            <div className='w-full xl:w-1/2'>
                <h5 className="text-xl md:text-2xl text-black uppercase font-semibold mb-5">
                    Premium Quality
                </h5>
                <h2 className="mb-5 text-3xl md:text-7xl text-black text-left font-bold max-w-full md:max-w-5xl">
                    Plumbing Service
                </h2>
                <p className='text-2xl text-black mb-15'>
                    Experience the best in plumbing service with our expert technicians and quality materials. Trust us for reliable solutions.
                </p>
                <Link href="/about" className='py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown'>
                    About Us
                </Link>
            </div>
        </section>
    )
}

export default ServicesBanner;