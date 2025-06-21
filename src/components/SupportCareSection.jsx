import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import aboutPosterOne from "../../public/about-poster-one.jpg";
import aboutPosterTwo from "../../public/aboutPoster-two.avif";

const SupportCareSection = () => {
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
                    Available
                </h5>
                <h2 className="mb-5 text-3xl md:text-7xl text-black text-left font-bold max-w-full md:max-w-5xl">
                    Support & Care
                </h2>
                <p className='text-2xl text-black mb-5'>
                   We're always online with personalized support available.
                </p>
                <div className='mb-10'>
                    <h6 className='text-xl text-black'>
                        <strong className='inline-block w-30'>Mon - Fri: </strong>
                        9am - 10pm
                    </h6>
                    <h6 className='text-xl text-black'>
                        <strong className='inline-block w-30'>Saturday: </strong>
                        9am - 6pm
                    </h6>
                </div>
                <Link href="/contact" className='py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown'>
                    Contact Us
                </Link>
            </div>
        </section>
    )
}

export default SupportCareSection