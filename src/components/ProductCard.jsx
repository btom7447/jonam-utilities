"use client";

import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cartContext';
import { useWishlist } from '@/contexts/wishlistContext';
import { ChevronRight, HeartIcon, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ProductCard = ({ data }) => {
  const router = useRouter();  
    const { addToCart } = useCart();
    const { saveProduct, isSaved } = useWishlist();
    const [timestamp, setTimestamp] = useState("");


    let discountPercent = null;
    let finalPrice = data.price;

    if (typeof data.discount === "number" && data.discount > 0 && data.discount < 1) {
        discountPercent = Math.round(data.discount * 100); // e.g. 0.03 -> 3%
        finalPrice = Math.round(data.price * (1 - data.discount));
    }

    useEffect(() => {
        setTimestamp(`?t=${Date.now()}`);
    }, []);

    return (
        <div className='flex flex-col'>
            <div className='w-full flex items-center justify-center bg-white group relative overflow-hidden'>
                {data?.discount > 0 && (
                    <span className='z-12 absolute top-5 left-5 py-2 px-3 bg-blue-500 text-white'>
                        - {discountPercent}%
                    </span>
                )}
                {data?.images?.[0]?.url && (
                    <Image
                        src={`${data.images[0].url}${timestamp}`}
                        alt={`${data.caption ?? data.name} thumbnail`}
                        width={50}
                        height={70}
                        className='w-70 h-80 object-cover transition-transform duration-300 group-hover:scale-120'
                        unoptimized
                    />
                )}
                {/* Dark overlay on group hover */}
                <div
                    className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none z-10"
                />
                <div
                    className='absolute inset-0 flex gap-5 items-center justify-center 
                        -translate-x-full group-hover:translate-x-0 
                        opacity-0 group-hover:opacity-100 
                        z-50 transition-all duration-300'
                    >
                    <button type='button' onClick={() => saveProduct(data)} className='p-3 rounded-full bg-white text-gray-700 cursor-pointer hover:text-blue-500 hover:-translate-y-3'>
                        <HeartIcon size={20} className={isSaved(data?.id) ? "text-blue-500" : ""} fill={isSaved(data?.id) ? "currentColor" : "none"} />
                    </button>
                    <button type='button'  
                        onClick={() => {
                            const enrichedProduct = {
                                ...data,
                                selectedColor: data?.product_colors?.[0] || null,
                                selectedVariant: data?.variants?.[0] || null,
                            };
                            addToCart(enrichedProduct);
                        }} 
                        className='p-3 rounded-full bg-white text-gray-700 cursor-pointer hover:text-blue-500 hover:-translate-y-3'
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button
                        type='button'
                        onClick={() => router.push(`/product/${data?.recordId}`)} 
                        className='p-3 rounded-full bg-white text-gray-700 cursor-pointer hover:text-blue-500 hover:-translate-y-3'
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            <div className='mt-5 w-full'>
                <Link href={`/product/${data?.recordId}`} className='w-full text-2xl font-semibold text-black capitalize hover:text-blue-500'>{data?.name}</Link>
                {data?.discount > 0 ? (
                    <div className="flex gap-3 items-center mt-1">
                        <p className="text-xl text-gray-500 line-through">
                            ₦{data?.price?.toLocaleString()}
                        </p>
                        <p className="text-2xl font-bold text-black">
                            ₦{finalPrice?.toLocaleString()}
                        </p>
                    </div>
                ) : (
                    <p className="text-2xl font-bold text-black mt-1">
                        ₦{typeof data?.price === 'number' ? data.price.toLocaleString() : ''}
                    </p>
                )}            
            </div>
        </div>
    );
};

export default ProductCard;
