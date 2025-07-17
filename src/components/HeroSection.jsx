"use client"

// bg-[#BD9168]
import Image from 'next/image'
import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import heroImage from "../../public/hero-image-2.webp"
import Link from 'next/link'

const HeroSection = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <section className='h-fit xl:h-[100dvh] mx-0 xl:mx-20 grid grid-cols-1 md:grid-cols-2'>
            {/* Left Side Content */}
            <div 
                className='sm:h-fit md:h-full flex flex-col justify-center items-start p-10 md:p-20'
                style={{
                    backgroundImage: 'url("/overlay-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <h1
                    className='text-4xl md:text-6xl font-bold text-white mb-3 md:mb-10 text-left max-w-full md:max-w-130'
                    data-aos="fade-up"
                    data-aos-anchor-placement="top-bottom"
                    data-aos-delay="0"
                >
                    Your trusted platform for all plumbing needs
                </h1>
                <p
                    className='text-white mb-10 text-xl md:text-2xl font-light text-left max-w-full md:max-w-130'
                    data-aos="fade-up"
                    data-aos-anchor-placement="top-bottom"
                    data-aos-delay="200"
                >
                    We are ready to make your plumbing dreams come true! Experience you can trust.
                </p>
                <Link href="/about">
                    <button
                        type="button"
                        className='bg-brown text-white text-xl py-5 px-10 cursor-pointer hover:bg-white hover:text-blue-500 transition-colors duration-300'
                        data-aos="fade-up"
                        data-aos-anchor-placement="top-bottom"
                        data-aos-delay="400"
                    >
                        Learn More
                    </button>
                </Link>
            </div>

            {/* Right Side - Image */}
            <div className='relative w-full h-[50vh] md:h-full'>
                <Image
                    src={heroImage}
                    alt='hero image of a fancy faucet'
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                    priority
                />
            </div>
        </section>
    )
}

export default HeroSection