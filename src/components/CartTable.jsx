"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cartContext";
import { useCheckout, STEP_INDEX } from "@/contexts/checkoutContext";
import { ChevronDown, ChevronUp, DeleteIcon, TicketIcon, TicketSlash, Trash2 } from "lucide-react";

const CartTable = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
    } = useCart();
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

    useEffect(() => {
        setStep(STEP_INDEX.checkout);
    }, [setStep]);

    const handleUpdateCart = () => {
        setStep(STEP_INDEX.payment)
        router.push("/checkout");
    };

    if (loading) return null;

    return (
        <section className="bg-blue-50 px-5 md:px-20 py-10 md:py-20 w-screen max-w-full overflow-x-auto">
            {cartItems?.length === 0 ? (
                <div>
                    <p className="text-center text-gray-700 text-3xl">Your cart is empty.</p>
                    <button
                        onClick={() => router.push("/shop")}
                        type="button"
                        className="block mx-auto my-5 py-5 px-10 text-xl bg-blue-500 text-white hover:bg-brown cursor-pointer"
                    >
                        Go to Shop
                    </button>
                </div>
            ) : (
                <>
                    <div className="w-[98dvw] lg:w-full overflow-x-auto">
                        <table className="table-auto min-w-full border-collapse mb-6 overflow-x-hidden">
                            <thead>
                                <tr className="bg-white text-left text-2xl">
                                    <th className="min-w-[320px] py-5 px-10">Product</th>
                                    <th className="py-5 px-10">Price</th>
                                    <th className="py-5 px-10">Quantity</th>
                                    <th className="py-5 px-10">Subtotal</th>
                                    <th className="py-5 px-10">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item, index) => {
                                    const price = item?.discount
                                        ? Math.round(item.price * (1 - item.discount))
                                        : item.price;

                                    return (
                                        <tr key={index} className="border-b border-gray-300">
                                            <td className="py-5 px-10 flex items-center gap-5 ">
                                                <Image
                                                    src={`${item.images[0]?.url}${timestamp}`}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                <h5 className="text-xl font-semibold text-gray-900 capitalize">{item.name}</h5>
                                            </td>
                                            <td className="py-5 px-10 text-xl text-gray-900">₦{price.toLocaleString()}</td>
                                            <td className="py-5 px-10">
                                                <div className="flex items-center border border-gray-500 px-3 py-2 w-fit">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                        className="w-15 text-center text-xl border-0 outline-0"
                                                    />
                                                    <div className="flex flex-col ml-2">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                            <ChevronUp size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <ChevronDown size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-10 text-xl text-gray-900">
                                                ₦{(price * item?.quantity).toLocaleString()}
                                            </td>
                                            <td className="py-5 px-10">
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(item.id, item.selectedColor, item.selectedVariant)
                                                    }
                                                    className="text-red-500 hover:text-red-800 cursor-pointer"
                                                >
                                                    <DeleteIcon size={25} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Total */}
                    <div className="text-right mt-10 text-2xl font-semibold text-gray-900">
                        Total: ₦{getTotalPrice().toLocaleString()}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                        {/* Coupon */}
                        <div className="w-full md:w-fit flex items-center gap-5 border border-gray-300 px-5">
                            <div className="w-full flex items-center gap-5">
                                <TicketSlash size={20} />
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    className="py-8 px-5 w-full text-xl outline-0 border-09"
                                />
                            </div>
                            <button className="min-w-35 text-gray-900 text-xl font-semibold cursor-pointer hover:text-blue-500">
                                Apply Coupon
                            </button>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-5">
                            <button
                                onClick={() => router.push("/shop")}
                                className="border border-gray-300 text-md lg:text-xl font-semibold text-gray-700 py-7 px-5 lg:px-10 cursor-pointer hover:bg-gray-900 hover:text-white hover:border-gray-900"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={handleUpdateCart}
                                className="bg-blue-500 text-white text-md lg:text-xl font-semibold py-7 px-7 lg:px-15 cursor-pointer hover:bg-brown"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default CartTable;
