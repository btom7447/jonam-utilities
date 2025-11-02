import React from 'react'
import ContactForm from './ContactForm'
import { Mail, MapPin, PhoneCall } from 'lucide-react'

const ContactPoster = () => {
    return (
        <section className='bg-blue-50 flex flex-wrap xl:flex-nowrap gap-5 xl:gap-20 px-5 md:px-20 py-20 items-center'>
            <div className='w-full xl:w-1/2'>
                <h5 className="text-xl md:text-2xl text-black uppercase font-semibold mb-5">
                    Contact Us
                </h5>
                <h2 className="mb-5 text-3xl md:text-7xl text-black text-left font-bold max-w-full md:max-w-5xl">
                    Have questions? <br />
                    Get in touch!
                </h2>
                <p className='text-2xl text-black mb-10'>
                    We're here to help with any questions or concerns you may have. Our team is ready to assist you. Please don't hesitate to reach out to us.
                </p>
                <ul>
                    <li className='flex items-center gap-10 text-blue-500 text-2xl mb-5'>
                        <MapPin size={20} />
                        Ile Ife, Osun State, Nigeria
                    </li>
                    <li className='flex items-center gap-10 text-blue-500 text-2xl mb-5'>
                        <PhoneCall size={20} />
                        <a href="tel:+2348060779377">+234 806 077 9377</a>
                    </li>
                    <li className='flex items-center gap-10 text-blue-500 text-2xl mb-5'>
                        <Mail size={20} />
                        <a href="mailto:contact@jonam.ng">contact@jonam.ng</a>
                    </li>
                </ul>
            </div>
            <ContactForm />
        </section>
    )
}

export default ContactPoster