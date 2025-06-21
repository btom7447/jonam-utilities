import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import posterImage from "../../public/quote-poster.jpg";

const QuotePoster = () => {
    return (
        <section className='w-full h-fit xl:h-[70dvh] grid grid-cols-1 xl:grid-cols-2'>
            <div
                className='px-5 md:px-20 py-20 flex flex-col justify-center items-start'
                style={{
                    backgroundImage: 'url("/bg-overlay.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <h2 className='text-3xl lg:text-7xl font-semibold text-white mb-5'>Jonam Utilities</h2>
                <p className='text-2xl font-light text-white mb-10'>Expert services in plumbing, installation, and maintenance for residential and commercial properties.</p>
                <Link href="/request-quote" className='py-5 px-10 text-xl bg-brown text-white hover:bg-white hover:text-black'>Request a Quote</Link>
            </div>
            <div className='relative w-full min-h-[200px] h-[20dvh] md:h-full'>
                <Image
                    src={posterImage}
                    alt='poster image'
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

export default QuotePoster