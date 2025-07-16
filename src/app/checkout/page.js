"use client";

import BillingDetails from '@/components/BillingDetails'
import CartHeader from '@/components/CartHeader'
import OrderDetails from '@/components/OrderDetails'
import PaymentOptions from '@/components/PaymentOptions'
import { useCart } from '@/contexts/cartContext'
import React, { useState } from 'react'

const Page = () => {
    const {
        cartItems,
        clearCart,
        getTotalPrice,
    } = useCart();
    const [deliveryPrice, setDeliveryPrice] = useState(0);

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