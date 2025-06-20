"use client";

import React from "react";
import { useCart } from "@/contexts/cartContext";
import CartModalItem from "./CartModalItem";
import { useRouter } from "next/navigation";

const CartModal = () => {
    const { cartItems, getTotalPrice, removeFromCart } = useCart();
    const router = useRouter();

    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="flex flex-col w-full rounded shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-5">Shopping Cart</h2>

            {/* Cart Items */}
            <div className="cartItems flex flex-col gap-5 max-h-60 lg:max-h-70 overflow-y-scroll my-5">
                {cartItems.length === 0 && <p className="text-center text-2xl font-light text-gray-500">Your cart is empty.</p>}

                {cartItems.map((item) => (
                    <CartModalItem key={item.id} item={item} removeFromCart={removeFromCart} />
                ))}
            </div>

            {/* Subtotal */}
            <div className="border-t-1 border-gray-700 flex justify-between font-semibold text-lg my-5 pt-5">
                <h6 className="text-2xl font-semibold text-white">Subtotal: ₦{getTotalPrice().toLocaleString()}</h6>
            </div>

            {/* Buttons */}
            <div className="flex gap-5">
                <button
                    onClick={() => router.push("/cart")}
                    className="flex-grow border-1 text-white text-xl border-gray-300 hover:bg-white hover:text-black p-3 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    disabled={isCartEmpty}
                >
                    View Cart
                </button>
                <button
                    onClick={() => router.push("/checkout")}
                    className="flex-grow border-1 text-white text-xl border-blue-500 bg-blue-500 hover:bg-brown hover:text-white hover:border-brown p-3 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    disabled={isCartEmpty}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default CartModal;
