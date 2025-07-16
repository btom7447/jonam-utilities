"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCheckout, STEP_INDEX } from "@/contexts/checkoutContext";

const OrderDetails = ({ cartItems, getTotalPrice, deliveryPrice }) => {
    const { setStep } = useCheckout();
    const router = useRouter();
    const [timestamp, setTimestamp] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimestamp(`?t=${Date.now()}`);
        // Small delay to ensure localStorage cart is loaded
        const timeout = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timeout);
    }, []);

    const grandTotal = getTotalPrice() + deliveryPrice;

    if (loading) return null;

    return (
        <div className="">
            {cartItems?.length === 0 ? (
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-5">Your Order</h3>
                    <div className="bg-white p-10">
                        <p className="text-center text-gray-700 text-3xl">No order</p>
                        <button
                            onClick={() => router.push("/shop")}
                            type="button"
                            className="block mx-auto my-5 py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer"
                        >
                            Go to Shop
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-5">Your Order</h3>
                    <div className="bg-white p-10">
                        {cartItems.map((item, index) => {
                            const price = item?.discount
                                ? Math.round(item.price * (1 - item.discount))
                                : item.price;

                            return (
                                <ul key={index} className="">
                                    <li className="py-5 flex items-center justify-between gap-5 border-b border-gray-300">
                                        <h5 className="text-xl font-light text-gray-900 capitalize">{item?.name} 
                                            <span> × {item?.quantity}</span>
                                        </h5>
                                        <h5 className="text-xl font-light text-gray-900 capitalize">₦{price.toLocaleString()}</h5>
                                    </li>
                                </ul>
                            );
                        })}
                        <ul>
                            <li className="py-3 flex items-center justify-between gap-5 border-b border-gray-300">
                                <h5 className="text-xl font-semibold text-gray-900 capitalize">
                                    Subtotal
                                </h5>
                                <h5 className="text-xl font-semibold text-gray-900 capitalize">
                                    ₦{cartItems.reduce((sum, item) => {
                                        const itemPrice = item?.discount
                                            ? Math.round(item.price * (1 - item.discount))
                                            : item.price;
                                        return sum + itemPrice * item.quantity;
                                    }, 0).toLocaleString()}
                                </h5>
                            </li>
                            <li className="py-3 flex items-center justify-between gap-5 border-b border-gray-300">
                                <h5 className="text-xl font-semibold text-gray-900 capitalize">Delivery</h5>
                                <h5 className="text-xl font-semibold text-gray-900 capitalize">
                                    {deliveryPrice === 0 ? "" : `₦${deliveryPrice.toLocaleString()}`}
                                </h5>
                            </li>
                            <li className="py-3 flex items-center justify-between gap-5">
                                <h5 className="text-2xl font-semibold text-blue-500 capitalize">Total</h5>
                                <h5 className="text-2xl font-semibold text-blue-500 capitalize">₦{grandTotal.toLocaleString()}</h5>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetails;