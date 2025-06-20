import Image from 'next/image';
import React, { useState } from 'react';

const ProductGallery = ({ product }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [zoomOrigin, setZoomOrigin] = useState('center');
    const [isZoomed, setIsZoomed] = useState(false);

    const handleThumbnailClick = (index) => setActiveIndex(index);
    const handleMouseMove = (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomOrigin(`${x}% ${y}%`);
    };

    return (
        <div className="flex flex-col-reverse md:flex-row gap-6 h-[400px]">
            {/* Thumbnails */}
            <div
                className="
                    flex 
                    flex-row md:flex-col 
                    gap-10 
                    w-full md:w-auto 
                    overflow-x-auto md:overflow-y-auto 
                    px-2
                "
            >
                {product.images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => handleThumbnailClick(i)}
                        className={`
                            flex-shrink-0
                            w-24 h-24       /* mobile size */
                            md:w-40 md:h-40 /* desktop size */
                            transition-opacity duration-300
                            ${i === activeIndex ? 'opacity-100' : 'opacity-50'}
                        `}
                    >
                    <Image
                        src={img.url}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                        unoptimized
                    />
                </button>
            ))}
        </div>

      {/* Main Image with Zoom */}
        <div className="flex-1 bg-white flex items-center justify-center h-full overflow-hidden">
            <div
                className="w-full h-full"
                style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: zoomOrigin,
                    transition: isZoomed ? 'transform 0s' : 'transform 0.2s ease-out',
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
            >
                <Image
                    src={product.images[activeIndex].url}
                    alt={`${product.name} main`}
                    width={500}
                    height={500}
                    className="object-contain w-full h-full"
                    unoptimized
                />
            </div>
        </div>
    </div>
  );
};

export default ProductGallery;
