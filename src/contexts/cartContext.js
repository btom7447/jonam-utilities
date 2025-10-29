"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🧩 Load from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // 💾 Save to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ Add item to cart
  const addToCart = (item, quantity = 1) => {
    let found = false;

    setCartItems((prev) => {
      // ✅ Compare using _id (MongoDB standard)
      const existing = prev.find(
        (i) =>
          i._id === item._id &&
          i.selectedColor === item.selectedColor &&
          i.selectedVariant === item.selectedVariant
      );

      if (existing) {
        found = true;
        return prev.map((i) =>
          i._id === item._id &&
          i.selectedColor === item.selectedColor &&
          i.selectedVariant === item.selectedVariant
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, { ...item, quantity }];
    });

    if (!found) {
      toast.info(`${item.name} added to cart`);
    } else {
      toast.info(`${item.name} quantity updated`);
    }
  };

  // ❌ Remove item from cart
  const removeFromCart = (_id, selectedColor, selectedVariant) => {
    const removedItem = cartItems.find(
      (item) =>
        item._id === _id &&
        item.selectedColor === selectedColor &&
        item.selectedVariant === selectedVariant
    );

    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item._id === _id &&
            item.selectedColor === selectedColor &&
            item.selectedVariant === selectedVariant
          )
      )
    );

    if (removedItem) {
      toast.info(`${removedItem.name} removed from cart`);
    }
  };

  // 🧹 Clear cart
  const clearCart = () => {
    setCartItems([]);
    // toast.info("All items removed from cart");
  };

  // 🔄 Update quantity
  const updateQuantity = (_id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(_id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item._id === _id ? { ...item, quantity } : item))
      );
    }
  };

  // 🧮 Get total quantity of all items
  const getCartQuantity = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🔢 Get number of distinct items
  const getCartCount = () => cartItems.length;

  // 💰 Compute total price
  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      let discount = 0;
      if (item.discount) {
        discount = item.discount > 1 ? item.discount / 100 : item.discount; // normalize %
      }

      const price = Math.round(item.price * (1 - discount));
      return total + price * item.quantity;
    }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getCartCount,
        getCartQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);