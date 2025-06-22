"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { XIcon, ShoppingCart } from "lucide-react";

const WishlistModalItem = ({ item, removeSavedProduct, addToCart }) => {
    const [timestamp, setTimestamp] = useState("");

    const finalPrice = item.discount
        ? Math.round(item.price * (1 - item.discount))
        : item.price;

    const handleMoveToCart = () => {
        addToCart(item);
        removeSavedProduct(item.id);
    };

    useEffect(() => {
        setTimestamp(`?t=${Date.now()}`);
    }, []);

    return (
        <div className="flex items-center gap-5">
            <Image
                src={`${item.images[0]?.url}${timestamp}`}
                alt={item.name}
                width={70}
                height={70}
                className="object-cover"
                unoptimized
            />
            <div className="flex-grow">
                <h5 className="text-2xl font-semibold text-white">{item.name} - {item.product_colors?.[0]}</h5>
                <div className="flex items-center gap-3 text-lg text-gray-300">
                    ₦{finalPrice.toLocaleString()}
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={handleMoveToCart} aria-label="Move to Cart" className="cursor-pointer">
                    <ShoppingCart size={20} className="text-blue-400 hover:text-blue-600" />
                </button>
                <button onClick={() => removeSavedProduct(item.id)} aria-label="Remove from Wishlist" className="cursor-pointer">
                    <XIcon size={20} className="text-gray-400 hover:text-white" />
                </button>
            </div>
        </div>
    );
};

export default WishlistModalItem;
