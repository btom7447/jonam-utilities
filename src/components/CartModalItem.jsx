"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";

const CartModalItem = ({ item, removeFromCart }) => {
    const [timestamp, setTimestamp] = useState("");

    // Calculate discount percentage if discount and price exist
    let discountPercent = null;
    let finalPrice = item.price;

    if (typeof item.discount === "number" && item.discount > 0 && item.discount < 1) {
        discountPercent = Math.round(item.discount * 100); // e.g. 0.03 -> 3%
        finalPrice = Math.round(item.price * (1 - item.discount));
    }

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
                <h5 className="text-2xl font-semibold text-white capitalize">
                    {item.name}
                    {item.selectedColor && ` - ${item.selectedColor}`}
                    {item.selectedVariant && ` - ${item.selectedVariant}`}
                </h5>
                <div className="flex flex-row items-center gap-1">
                    <h6 className="text-xl font-light text-gray-300">{item.quantity} </h6>
                    <XIcon size={12} className="text-xl font-light text-gray-300" /> 
                    <h6 className="text-xl font-light text-gray-300">₦{(finalPrice).toLocaleString()}</h6>
                </div>
            </div>
            <button 
                type="button" 
                onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedVariant)}
                aria-label="Remove item from cart"
                className="cursor-pointer text-gray-400 hover:text-white"
            >
                <XIcon size={20} />
            </button>
        </div>
    );
};

export default CartModalItem;
