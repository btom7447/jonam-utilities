"use client";

import React from 'react'
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { feedback } from '@/contexts/feedbackData';
import { Star } from 'lucide-react';

const FeedbackSection = () => {
    return (
        <section className="flex flex-col items-center justify-center bg-blue-50 px-5 md:px-20 py-20">
            <h5 className="text-xl md:text-2xl text-black uppercase font-semibold mb-5">
                Client Feedback
            </h5>
            <h2 className="text-3xl md:text-7xl text-black text-center font-bold max-w-full md:max-w-5xl">
                What People Say About Us
            </h2>

            <Splide
                options={{
                    type: "loop",
                    perPage: 3,
                    perMove: 1,
                    gap: "30px",
                    autoplay: true,
                    interval: 2500,
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        1440: { perPage: 3},
                        1024: { perPage: 3 },
                        768: { perPage: 2},
                        640: { perPage: 1 },
                    },
                }}
                className="w-full px-10"
            >
                {feedback.map((feedback) => (
                    <SplideSlide key={feedback.id}>
                        <div className="bg-white p-10 flex flex-col justify-between">
                            <div className="flex gap-1 text-yellow-500 text-xl mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className="text-yellow-500"
                                        fill={i < feedback.starRating ? 'currentColor' : 'none'} 
                                    />
                                ))}
                            </div>
                                
                            <p className="mt-10 text-gray-700 text-2xl">{feedback.feedback}</p>
                            <div className="mt-10 ">
                                <h5 className="font-bold text-xl text-black">{feedback.name}</h5>
                                <h6 className="text-xl text-gray-500">{feedback.title}</h6>
                            </div>
                        </div>
                    </SplideSlide>

                ))}
            </Splide>
        </section>
    )
}

export default FeedbackSection