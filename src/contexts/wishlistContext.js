"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [savedItems, setSavedItems] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("wishlist");
        if (stored) {
            setSavedItems(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(savedItems));
    }, [savedItems]);

    const saveProduct = (product) => {
        if (!savedItems.find((item) => item.id === product.id)) {
            setSavedItems((prev) => [...prev, product]);
            toast.info(`${product.name} saved to wishlist`);
        }
    };

    const removeSavedProduct = (id) => {
        setSavedItems((prev) => prev.filter((item) => item.id !== id));
    };

    const isSaved = (id) => {
        return savedItems.some((item) => item.id === id);
    };

    const clearWishlist = () => {
        setSavedItems([]);
        toast.info("Wishlist cleared");
    };

    return (
        <WishlistContext.Provider
            value={{
                savedItems,
                saveProduct,
                removeSavedProduct,
                clearWishlist,
                isSaved,
                getSavedCount: () => savedItems.length,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
