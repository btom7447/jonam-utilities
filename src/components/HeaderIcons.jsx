"use client";

import React, { useState, useRef, useEffect } from 'react';
import { HeartIcon, Search, SearchIcon, ShoppingBag, XIcon } from 'lucide-react';
import { useCart } from '@/contexts/cartContext';
import { useWishlist } from '@/contexts/wishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartModal from './CartModal';
import WishlistModal from './WishlistModal';
import SearchModal from './SearchModal';

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
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -250 }}
                        transition={{ duration: 0.5 }}
                        className="
                            fixed
                            sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2
                            sm:w-[90vw] sm:h-[90vh] sm:max-w-md sm:max-h-[600px]
                            bg-gray-900 z-50 shadow-xl p-10

                            lg:absolute lg:top-21 lg:right-0 lg:w-120 lg:h-fit lg:p-10
                        "
                    >
                        <button
                            onClick={closeModal}
                            className='absolute top-5 right-5 text-gray-500 hover:text-white text-xl cursor-pointer'
                        >
                            <XIcon size={30} />
                        </button>
                        {activeModal === 'cart' && <CartModal />}
                        {activeModal === 'wishlist' && <WishlistModal />}
                        {activeModal === 'search' && <SearchModal />}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Icon */}
            <div className='relative' onClick={() => toggleModal('search')}>
                <SearchIcon size={28} strokeWidth={1} className='text-black cursor-pointer' />
            </div>
            {/* <Search size={28} strokeWidth={1} className='text-black cursor-pointer' /> */}
        </div>
    );
};

export default HeaderIcons;
