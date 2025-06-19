"use client";

import React, { useState, useRef, useEffect } from 'react';
import { HeartIcon, Search, ShoppingBag, XIcon } from 'lucide-react';
import { useCart } from '@/contexts/cartContext';
import { useWishlist } from '@/contexts/wishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartModal from './CartModal';
import WishlistModal from './WishlistModal';

const HeaderIcons = () => {
    const { getCartCount } = useCart();
    const { getSavedCount } = useWishlist();
    const [isOpen, setIsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null); 
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const toggleModal = (type) => {
        setActiveModal(type);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setActiveModal(null);
    };

    return (
        <div className='flex items-center space-x-10 relative z-50'>
            {/* Cart Icon */}
            <div className='relative' onClick={() => toggleModal('cart')}>
                <ShoppingBag size={28} strokeWidth={1} className='text-black cursor-pointer' />
                {isHydrated && getCartCount() > 0 && (
                    <span className="py-1 px-2 absolute -top-2 -right-2 bg-brown text-white text-xs rounded-full flex items-center justify-center">
                        {getCartCount()}
                    </span>
                )}
            </div>

            {/* Wishlist Icon */}
            <div className='relative' onClick={() => toggleModal('wishlist')}>
                <HeartIcon size={28} strokeWidth={1} className='text-black cursor-pointer' />
                {isHydrated && getSavedCount() > 0 && (
                    <span className="py-1 px-2 absolute -top-2 -right-2 bg-brown text-white text-xs rounded-full flex items-center justify-center">
                        {getSavedCount()}
                    </span>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className='absolute top-18 lg:top-21 -right-42 lg:right-0 min-w-md  p-10 bg-gray-900 z-50 shadow-xl'
                    >
                        <button
                            onClick={closeModal}
                            className='absolute top-5 right-5 text-gray-500 hover:text-white text-xl cursor-pointer'
                        >
                            <XIcon size={25} />
                        </button>
                        {activeModal === 'cart' && <CartModal />}
                        {activeModal === 'wishlist' && <WishlistModal />}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Icon */}
            <Search size={28} strokeWidth={1} className='text-black cursor-pointer' />
        </div>
    );
};

export default HeaderIcons;
