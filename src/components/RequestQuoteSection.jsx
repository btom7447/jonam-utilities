import React from 'react'
import QuoteForm from './QuoteForm'

const RequestQuoteSection = () => {
  return (
    <section
        className='bg-blue-50 w-full flex flex-col xl:flex-row justify-center items-center px-5 md:px-20 xl:px-30 py-10 xl:py-30'
    >
        <div
            className='
                w-full xl:w-1/2 mx-5 lg:m-0 p-10 lg:p-20 flex flex-col 
            '
        >
            <h5 className="text-xl md:text-2xl text-black text-left uppercase font-semibold mb-5">
                Request
            </h5>
            <h2 className="mb-10 text-3xl md:text-7xl text-black text-left font-bold max-w-full md:max-w-5xl">
                A Free, No-Obligation Quote
            </h2>
            <p className='text-2xl text-gray-700 mb-5'>
                Tell us about your plumbing project, and we'll provide a detailed quote. Our goal is to deliver exceptional service at a fair price
            </p>
            
        </div>
        <QuoteForm />
    </section>
  )
}

export default RequestQuoteSection