"use client";

import { useCart } from '@/contexts/cartContext';
import { useWishlist } from '@/contexts/wishlistContext';
import { ChevronDown, ChevronUp, Heart, } from 'lucide-react';
import React, { useState } from 'react';

const UtilityButtons = ({ product, selectedColor, selectedVariant }) => {
    const { addToCart } = useCart();
    const { saveProduct, removeSavedProduct, isSaved } = useWishlist();
    const [quantity, setQuantity] = useState("1");

    const increaseQuantity = () => setQuantity((prev) => `${Math.max(1, parseInt(prev || '1') + 1)}`);
    const decreaseQuantity = () =>
        setQuantity((prev) => `${Math.max(1, parseInt(prev || '1') - 1)}`);

    const handleChange = (e) => {
    const val = e.target.value;
        if (val === '' || /^[0-9\b]+$/.test(val)) {
            setQuantity(val);
        }
    };

    const toggleSave = () => {
        if (isSaved(product.id)) {
            removeSavedProduct(product.id);
        } else {
            saveProduct(product);
        }
    };

    const enrichedProduct = {
        ...product,
        selectedColor,
        selectedVariant,
    };

    return (
        <div className="mt-10 flex flex-wrap items-center gap-5">
            {/* Quantity Selector */}
            <div className='w-2/3 md:w-30'>
                <div className="max-w-30 flex items-center border-1 border-gray-500 px-5 py-4">
                    <input
                        type="text"
                        min={1}
                        value={quantity}
                        onChange={handleChange}
                        className="w-10 text-center text-xl mr-3 border-0 outline-0"
                    />
                    <div className='flex flex-col'>
                        <button type="button" onClick={increaseQuantity} className='cursor-pointer'>
                            <ChevronUp size={15} />
                        </button>
                        <button type="button" onClick={decreaseQuantity} disabled={quantity === 1} className='cursor-pointer'>
                            <ChevronDown size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add to Cart */}
            <button
                type="button"
                onClick={() => {
                    const qty = Math.max(1, parseInt(quantity) || 1); 
                    addToCart(enrichedProduct, qty);
                    setQuantity('1');
                }}
                className="cursor-pointer py-5 px-10 bg-blue-500 text-white text-2xl hover:bg-brown"
            >
                Add to Cart
            </button>

            {/* Wishlist Button */}
            <button
                type="button"
                onClick={toggleSave}
                className=" p-5 rounded-full text-gray-700 cursor-pointer hover:text-blue-500 border-1 border-gray-500"
            >
                <Heart
                    size={20}
                    className={isSaved(enrichedProduct.id) ? 'text-blue-500' : ''}
                    fill={isSaved(enrichedProduct.id) ? "currentColor" : "none"}
                />
            </button>
        </div>
    );
};

export default UtilityButtons;
