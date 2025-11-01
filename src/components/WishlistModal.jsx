"use client";

import React from "react";
import WishlistModalItem from "./WishlistModalItem";
import { useWishlist } from "@/contexts/wishlistContext";
import { useCart } from "@/contexts/cartContext";
import { useRouter } from "next/navigation";

const WishlistModal = ({ closeModal }) => {
    const { savedItems, removeSavedProduct, clearWishlist } = useWishlist();
    const { addToCart } = useCart();
    const router = useRouter();

    const handleMoveAllToCart = () => {
        savedItems.forEach((item) => {
            addToCart(item);
        });
        clearWishlist();
        closeModal(true);
    };

    const handleClearWishList = () => {
        clearWishlist();
        closeModal(true);
    }
    const isWishlistEmpty = savedItems.length === 0;

    return (
        <div className="flex flex-col w-full rounded shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-5">Wishlist</h2>

            <div className="cartItems flex flex-col gap-5 h-[65dvh] xl:max-h-80 overflow-y-scroll my-5">
                {isWishlistEmpty && <p className="my-5 text-center text-2xl font-light text-gray-500">Your wishlist is empty.</p>}

                {savedItems.map((item) => (
                    <WishlistModalItem
                        key={item.id}
                        item={item}
                        removeSavedProduct={removeSavedProduct}
                        addToCart={addToCart}
                    />
                ))}
            </div>

            <div className="h-[20dvh] lg:h-fit ">
                <div className="flex gap-5">
                    <button
                        onClick={handleClearWishList}
                        className="flex-grow border-1 text-white text-xl border-gray-300 hover:bg-white hover:text-black p-3 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                        disabled={isWishlistEmpty}
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleMoveAllToCart}
                        className="flex-grow border-1 text-white text-xl border-blue-500 bg-blue-500 hover:bg-brown hover:text-white hover:border-brown p-3 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                        disabled={isWishlistEmpty}
                    >
                        All to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistModal;