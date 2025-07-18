import Link from 'next/link'
import React from 'react'

const NoProduct = () => {
  return (
    <div className='mt-30 mb-30 flex flex-col items-center justify-center'>
      <h5 className='mb-5 text-center text-3xl font-semibold text-black'>
        No Product Found
      </h5>
      <p className='mb-10 text-xl font-light text-gray-700'>Check our other products or try searching again.</p>
      <Link href="/shop" className='py-5 px-10 bg-blue-500 text-white text-xl hover:bg-brown cursor-pointer'>Explore Products</Link>
    </div>
  )
}

export default NoProduct