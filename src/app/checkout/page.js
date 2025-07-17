"use client";

import BillingDetails from '@/components/BillingDetails'
import CartHeader from '@/components/CartHeader'
import OrderDetails from '@/components/OrderDetails'
import PaymentOptions from '@/components/PaymentOptions'
import { useCart } from '@/contexts/cartContext'
import { useCheckout, STEP_INDEX } from '@/contexts/checkoutContext';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const {
        cartItems,
        clearCart,
        getTotalPrice,
    } = useCart();
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const searchParams = useSearchParams();
    const { setStep } = useCheckout();

    useEffect(() => {
        const from = searchParams.get("from");
        if (from === "cart-modal") {
            setStep(STEP_INDEX.payment);
        }
    }, [searchParams, setStep]);

    return (
        <>
            <CartHeader />
            <section className=' px-5 md:px-20 py-10 md:py-20 bg-blue-50 grid grid-cols-1 xl:grid-cols-2 gap-20 '>
                <BillingDetails deliveryPrice={deliveryPrice} setDeliveryPrice={setDeliveryPrice} />
                <div className='space-y-15'>
                    <OrderDetails deliveryPrice={deliveryPrice} cartItems={cartItems} getTotalPrice={getTotalPrice} />
                    <PaymentOptions clearCart={clearCart} />
                </div>
            </section>
        </>
    )
}

export default Page