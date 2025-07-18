import { Star } from 'lucide-react';
import React from 'react'

const ProjectDetails = ({ data }) => {

    const descriptionParts = typeof data?.description === "string"
        ? data?.description.split("|").map(part => part.trim())
        : [data?.description];


    // Format date to a more readable format (e.g., "April 5, 2024")
    const formattedDate = data?.date
        ? new Date(data.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "";

    return (
        <div>
            <h2 className='mb-10 text-5xl font-semibold text-black'>{data?.name}</h2>

            {descriptionParts?.map((part, idx) => (
                <p key={idx} className='text-xl text-gray-700 mb-5'>{part}</p>
            ))}

            <div className='mt-10'>
                <h5 className='mb-2 text-2xl font-light text-gray-700 capitalize'>
                    <strong className='font-bold inline-block mr-2 w-40 text-black'>Client </strong>
                    {data?.client_name}
                </h5>
                <h5 className='mb-2 text-2xl font-light text-gray-700 capitalize'>
                    <strong className='font-bold inline-block mr-2 w-40 text-black'>Date </strong>
                    {formattedDate}
                </h5>
            </div>
            <h5 className='mt-10 text-3xl text-black font-semibold'>Client Review</h5>
            <h6 className='mt-5 text-xl text-gray-500'>{data?.client_review}</h6>
            <div className="mt-5 flex gap-1 text-yellow-500 text-xl mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={20}
                        className="text-yellow-500"
                        fill={i < data?.client_rating ? 'currentColor' : 'none'} 
                    />
                ))}
            </div>
        </div>
    )
}

export default ProjectDetails
