"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setSavedItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(savedItems));
  }, [savedItems]);

  // ✅ Normalize a value (string or array) into a clean array
  const normalizeToArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      if (value.length === 1 && typeof value[0] === "string") {
        return value[0]
          .split(/[,|]/)
          .map((v) => v.trim())
          .filter(Boolean);
      }
      return value.map((v) => String(v).trim());
    }
    if (typeof value === "string") {
      return value
        .split(/[,|]/)
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  };

  // ✅ Normalize _id/id
  const normalizeId = (item) => item._id || item.id;

  const saveProduct = (product) => {
    const id = normalizeId(product);

    // ✅ Pick the first color/variant automatically
    const colorList = normalizeToArray(product?.product_colors);
    const variantList = normalizeToArray(product?.variants);

    const enrichedProduct = {
      ...product,
      selectedColor: colorList[0] || null,
      selectedVariant: variantList[0] || null,
    };

    if (!savedItems.find((item) => normalizeId(item) === id)) {
      setSavedItems((prev) => [...prev, enrichedProduct]);
      toast.info(`${product.name} saved to wishlist`);
    }
  };

  const removeSavedProduct = (id) => {
    setSavedItems((prev) => prev.filter((item) => normalizeId(item) !== id));
  };

  const isSaved = (id) => savedItems.some((item) => normalizeId(item) === id);

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
