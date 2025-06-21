"use client";

import React, { useRef, useState } from "react";

const VideoSection = () => {
    const containerRef = useRef(null);
    const [position, setPosition] = useState({ x: "50%", y: "50%" });
    const [isInside, setIsInside] = useState(false);

    const handleMouseMove = (e) => {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setPosition({ x: offsetX, y: offsetY });
        setIsInside(true);
    };

    const resetPosition = () => {
        setIsInside(false);
        setPosition({ x: "50%", y: "50%" });
    };

    return (
        <section
            className="h-[40dvh] lg:h-[80dvh] relative flex items-center justify-center"
            style={{
                backgroundImage: 'url("/video-poster.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />

            {/* Button tracking container */}
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetPosition}
                className="relative z-20 w-70 lg:w-100 h-70 lg:h-100 cursor-pointer"
            >
                <button
                    type="button"
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent border border-white text-xl text-white uppercase cursor-pointer px-10 py-12 transition-transform duration-300 ease-out"
                    style={{
                        left: position.x,
                        top: position.y,
                    }}
                >
                    Play
                </button>
            </div>
        </section>
    );
};

export default VideoSection;
