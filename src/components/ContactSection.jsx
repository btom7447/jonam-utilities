import React from 'react';
import ContactForm from './ContactForm';

const ContactSection = () => {
    return (
        <section
            className='w-full h-fit xl:h-[140dvh] flex justify-center items-center relative'
            style={{
                backgroundImage: 'url("/contact-poster-two.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div
                className='
                    w-full xl:w-1/2 bg-white mx-10 my-20 g:m-0 p-10 lg:p-20 flex flex-col 
                    xl:absolute xl:left-20 xl:top-1/2 xl:-translate-y-1/2
                '
            >
                <h5 className="text-xl md:text-2xl text-black text-center uppercase font-semibold mb-5">
                    Contact Us
                </h5>
                <h2 className="mb-10 text-3xl md:text-7xl text-black text-left font-bold max-w-full md:max-w-5xl">
                    Have questions? <br />
                    Get in touch!
                </h2>
                <ContactForm />
            </div>
        </section>
    );
};

export default ContactSection;
