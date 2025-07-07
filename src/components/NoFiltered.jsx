import React from 'react'

const NoFiltered = () => {
  return (
    <div className='mt-30 mb-30 flex flex-col items-center justify-center'>
      <h5 className='mb-5 text-center text-3xl font-semibold text-black'>
        No Match Found
      </h5>
      <p className='mb-10 text-xl font-light text-gray-700'>It seems we couldn't find what you're looking for.</p>
    </div>
  )
}

export default NoFiltered