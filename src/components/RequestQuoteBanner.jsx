import Link from 'next/link'
import React from 'react'

const RequestQuoteBanner = () => {
    return (
        <section className='w-full bg-blue-500 px-5 md:px-20 py-20 flex flex-col lg:flex-row gap-10 items-center justify-between'>
            <h2 className='w-full text-3xl md:text-5xl text-white text-center lg:text-left font-bold'>
                Schedule an appointment to meet or email us your questions
            </h2>
            <div className='w-full lg:w-1/2 flex gap-5 lg:gap-10 flex-col items-center lg:flex-row'>
                <Link href="/request-quote" className='py-5 px-10 text-xl bg-brown text-white hover:bg-white hover:text-brown '>Request a Quote</Link>
                <Link href="/contact" className='py-4 px-15 text-xl border-2 border-white text-white hover:bg-white hover:text-blue-500'>Contact Us</Link>
            </div>
        </section>
    )
}

export default RequestQuoteBanner