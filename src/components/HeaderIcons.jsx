"use client";

import React, { useState, useEffect } from 'react';
import {
  HeartIcon,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon
} from 'lucide-react';
import { useCart } from '@/contexts/cartContext';
import { useWishlist } from '@/contexts/wishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartModal from './CartModal';
import WishlistModal from './WishlistModal';
import ProfileModal from './ProfileModal';
import AuthModal from './AuthModal';
import { getUserSession } from '@/lib/firebase'; 

const HeaderIcons = ({ hamburgerIsOpen }) => {
    const { getCartCount } = useCart();
    const { getSavedCount } = useWishlist();

    const [isHydrated, setIsHydrated] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const toggleModal = async (type) => {
        if (type === 'profile') {
            const session = await getUserSession();
            if (!session?.isLoggedIn) {
                setShowAuthModal(true);
                return;
            }
        }

        setActiveModal(type);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setActiveModal(null);
    };

    return (
        <div className='flex items-center space-x-5 lg:space-x-10 relative z-50'>
            {/* Cart Icon */}
            <div className='relative' onClick={() => toggleModal('cart')}>
                <ShoppingCartIcon size={28} strokeWidth={1} className='text-black cursor-pointer' />
                {isHydrated && getCartCount() > 0 && (
                    <span className="py-1 px-2 absolute -top-2 -right-2 bg-brown text-white text-xs rounded-full flex items-center justify-center">
                        {getCartCount()}
                    </span>
                )}
            </div>

            {/* Wishlist Icon */}
            <div className='relative' onClick={() => toggleModal('wishlist')}>
                <HeartIcon size={28} strokeWidth={1} className='text-black cursor-pointer hover:text-red-500' />
                {isHydrated && getSavedCount() > 0 && (
                    <span className="py-1 px-2 absolute -top-2 -right-2 bg-brown text-white text-xs rounded-full flex items-center justify-center">
                        {getSavedCount()}
                    </span>
                )}
            </div>

            {/* User Icon */}
            <div className='relative' onClick={() => toggleModal('profile')}>
                <UserIcon size={28} strokeWidth={1} className='text-black cursor-pointer' />
            </div>

            {/* Hamburger Menu */}
            <button className="xl:hidden text-black" onClick={() => hamburgerIsOpen(!isOpen)}>
                <MenuIcon size={28} />
            </button>

            {/*  Content Modal (Cart, Wishlist, Profile) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -180 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -250 }}
                        transition={{ duration: 0.5 }}
                        className={`fixed -top-5  w-screen h-screen bg-gray-900 z-50 shadow-xl p-10 xl:absolute xl:top-19 xl:-left-70 ${activeModal === 'profile' ? 'xl:w-70 xl:left-[-60] left-0' : 'xl:w-120 left-0'} xl:h-fit xl:p-10`}
                    >
                        <button
                            onClick={closeModal}
                            className='absolute top-10 right-10 text-gray-500 hover:text-white text-xl cursor-pointer'
                        >
                            <XIcon size={30} />
                        </button>
                        {activeModal === 'cart' && <CartModal closeModal={closeModal} />}
                        {activeModal === 'wishlist' && <WishlistModal closeModal={closeModal} />}
                        {activeModal === 'profile' && <ProfileModal closeModal={closeModal} />}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Modal (only when not logged in) */}
            <AnimatePresence>
                {showAuthModal && (
                    <AuthModal onClose={() => setShowAuthModal(false)} back={false} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HeaderIcons;
