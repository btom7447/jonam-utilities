import Image from 'next/image';
import React from 'react';
import posterImageOne from "../../public/service-poster-two.jpg";
import posterImageTwo from "../../public/service-poster-one.jpg";

const ServicesPoster = () => {
    return (
        <section className='flex flex-wrap xl:flex-nowrap gap-5 xl:gap-20 px-5 md:px-20 py-20 items-center'>
            <div className='flex gap-5 w-full xl:w-1/2 h-full overflow-hidden'>
                <Image
                    src={posterImageOne}
                    alt='service poster one'
                    width={300}
                    height={300}
                    className='w-1/2 object-cover max-h-70 md:max-h-120 lg:h-full'
                    unoptimized
                />
                <Image
                    src={posterImageTwo}
                    alt='service poster two'
                    width={300}
                    height={300}
                    className='w-1/2 object-cover max-h-70 md:max-h-120 lg:h-full'
                    unoptimized
                />
            </div>

            {/* Caption - controls height */}
            <div className="w-full xl:w-1/2 flex flex-col justify-center">
                <h5 className="text-xl md:text-2xl text-black text-left uppercase font-semibold mb-5">
                    Our Services
                </h5>
                <h2 className="mb-10 text-3xl md:text-7xl text-black text-left font-bold max-w-full md:max-w-5xl">
                    Plumbing Solutions for you
                </h2>
                <ul className="text-lg text-black space-y-4">
                    <li className='text-2xl tex-black'>
                        <strong>Installation: </strong>
                        New plumbing systems, fixtures and appliances
                    </li>
                    <li className='text-2xl tex-black'>
                        <strong>Maintenance: </strong>
                        Regular check-ups, drain cleaning, and leak detection.
                    </li>
                    <li className='text-2xl tex-black'>
                        <strong>Repair: </strong>
                        Emergency fixes, pipe repairs, and fixture replacements.
                    </li>
                    <li className='text-2xl tex-black'>
                        <strong>Upgrades: </strong>
                        Modernize your plumbing with new technology and efficient systems
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default ServicesPoster;
