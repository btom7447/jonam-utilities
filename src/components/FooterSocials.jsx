import React from 'react'
import { ChevronRight, FacebookIcon, Inbox, InstagramIcon, LinkedinIcon, Mail, TwitterIcon, XIcon } from 'lucide-react';


const FooterSocials = () => {
    return (
        <section className='w-full flex flex-row items-center justify-center bg-white'>
            <div className='flex-1/4 py-7 flex flex-row justify-center items-center gap-3 border-r-1 border-gray-500 cursor-pointer group'>
                <FacebookIcon size={20} className='text-gray-900 group-hover:text-blue-500' />
                <a href='' className='hidden lg:block text-xl group-hover:text-blue-500'>Facebook</a>
            </div>
            <div className='flex-1/4 py-7 flex flex-row justify-center items-center gap-3 border-r-1 border-gray-500 cursor-pointer group'>
                <InstagramIcon size={20} className='text-gray-900 group-hover:text-blue-500' />
                <a href='' className='hidden lg:block text-xl group-hover:text-blue-500'>Instagram</a>
            </div>
            <div className='flex-1/4 py-7 flex flex-row justify-center items-center gap-3 border-r-1 border-gray-500 cursor-pointer group'>
                <TwitterIcon size={20} className='text-gray-900 group-hover:text-blue-500' />
                <a href='' className='hidden lg:block text-xl group-hover:text-blue-500'>Twitter</a>
            </div>
            <div className='flex-1/4 py-7 flex flex-row justify-center items-center gap-3 cursor-pointer group'>
                <LinkedinIcon size={20} className='text-gray-900 group-hover:text-blue-500' />
                <a href='' className='hidden lg:block text-xl group-hover:text-blue-500'>LinkedIn</a>
            </div>
        </section>
    )
}

export default FooterSocials