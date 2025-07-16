import React from 'react'
import OrderProgress from './OrderProgress'

const CartHeader = () => {
    return (
        <div className='bg-blue-50 px-5 md:px-20 pt-10 md:pt-20'>
            <OrderProgress />
        </div>
    )
}

export default CartHeader