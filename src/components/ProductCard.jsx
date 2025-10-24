"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cartContext";
import { useWishlist } from "@/contexts/wishlistContext";
import { ChevronRight, HeartIcon, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProductCard = ({ data }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { saveProduct, removeSavedProduct, isSaved } = useWishlist();
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setTimestamp(`?t=${Date.now()}`);
  }, []);

  if (!data || typeof data !== "object") return null;

  // ✅ Normalize any string or array into a clean array
  const normalizeToArray = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      if (value.length === 1 && typeof value[0] === "string") {
        // Handle ["Red, Blue"]
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

  const colorList = normalizeToArray(data?.product_colors);
  const variantList = normalizeToArray(data?.variants);

  const id = data?._id;
  const name = data?.name ?? "Untitled Product";
  const price = Number(data?.price) || 0;
  const discount = data?.discount ? parseFloat(data.discount) || 0 : 0;

  // ✅ Calculate discounted price
  let discountPercent = null;
  let finalPrice = price;
  if (discount > 0 && discount < 1) {
    discountPercent = Math.round(discount * 100);
    finalPrice = Math.round(price * (1 - discount));
  }

  // ✅ Enrich product with first color/variant
  const enrichedProduct = {
    ...data,
    selectedColor: colorList[0] || null,
    selectedVariant: variantList[0] || null,
  };

  const toggleSave = () => {
    if (isSaved(id)) removeSavedProduct(id);
    else saveProduct(enrichedProduct);
  };

  const imageUrl =
    data?.images?.[0]?.url || "https://placehold.co/400x400?text=No+Image";

  return (
    <div className="flex flex-col">
      <div className="w-full flex items-center justify-center bg-white group relative overflow-hidden">
        {/* Discount badge */}
        {discount > 0 && (
          <span className="z-10 absolute top-5 left-5 py-2 px-3 bg-blue-500 text-white text-sm">
            -{discountPercent ?? discount}% OFF
          </span>
        )}

        <Image
          src={`${imageUrl}${timestamp}`}
          alt={name}
          width={300}
          height={350}
          className="w-72 h-80 object-cover transition-transform duration-300 group-hover:scale-110"
          unoptimized
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none z-10" />

        {/* Hover buttons */}
        <div
          className="absolute inset-0 flex gap-5 items-center justify-center 
          -translate-x-full group-hover:translate-x-0 
          opacity-0 group-hover:opacity-100 
          z-50 transition-all duration-300"
        >
          {/* Wishlist */}
          <button
            type="button"
            onClick={toggleSave}
            className="p-3 rounded-full bg-white text-gray-700 cursor-pointer hover:text-blue-500 hover:-translate-y-3 transition-transform"
          >
            <HeartIcon
              size={20}
              className={isSaved(id) ? "text-blue-500" : ""}
              fill={isSaved(id) ? "currentColor" : "none"}
            />
          </button>

          {/* Add to cart */}
          <button
            type="button"
            onClick={() => addToCart(enrichedProduct)}
            className="p-3 rounded-full bg-white text-gray-700 cursor-pointer hover:text-blue-500 hover:-translate-y-3 transition-transform"
          >
            <ShoppingCart size={20} />
          </button>

          {/* View product */}
          <button
            type="button"
            onClick={() => router.push(`/product/${id}`)}
            className="p-3 rounded-full bg-white text-gray-700 cursor-pointer hover:text-blue-500 hover:-translate-y-3 transition-transform"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-5 w-full">
        <Link
          href={`/product/${id}`}
          className="w-full text-lg lg:text-xl font-semibold text-black capitalize hover:text-blue-500"
        >
          {name}
        </Link>

        {discount > 0 ? (
          <div className="flex gap-3 items-center mt-1">
            <p className="text-lg text-gray-500 line-through">
              ₦{price.toLocaleString()}
            </p>
            <p className="text-lg xl:text-xl font-bold text-black">
              ₦{finalPrice.toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-lg xl:text-xl font-bold text-black mt-1">
            ₦{price.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;