"use client";

import React, { useState, useMemo } from "react";
import UtilityButtons from "./UtilityButtons";
import CustomSelect from "./CustomSelect";

const ProductDetailCaption = ({ product }) => {
  // ✅ Convert color/variant strings into arrays (fallback-safe)
 const productColors = useMemo(() => {
   let colors = product?.product_colors;

   // Handle single-element arrays like ["Silver, Gold, Black"]
   if (
     Array.isArray(colors) &&
     colors.length === 1 &&
     typeof colors[0] === "string"
   ) {
     colors = colors[0];
   }

   if (Array.isArray(colors)) return colors.map((c) => c.trim());
   if (typeof colors === "string")
     return colors
       .split(/[,|]/) // split by comma or pipe, just in case
       .map((c) => c.trim())
       .filter(Boolean);
   return [];
 }, [product]);

 const productVariants = useMemo(() => {
   let variants = product?.variants;

   // Handle single-element arrays like ["BM-100, BMA, BidetPro"]
   if (
     Array.isArray(variants) &&
     variants.length === 1 &&
     typeof variants[0] === "string"
   ) {
     variants = variants[0];
   }

   if (Array.isArray(variants)) return variants.map((v) => v.trim());
   if (typeof variants === "string")
     return variants
       .split(/[,|]/)
       .map((v) => v.trim())
       .filter(Boolean);
   return [];
 }, [product]);

  const [selectedColor, setSelectedColor] = useState(productColors[0] || "");
  const [selectedVariant, setSelectedVariant] = useState(
    productVariants[0] || ""
  );

  // ✅ Handle discount as whole number (e.g. 3 → 3%)
  const hasDiscount =
    typeof product?.discount === "number" && product.discount > 0;
  const discountPercent = hasDiscount ? product.discount : null;
  const finalPrice = hasDiscount
    ? Math.round(product.price * (1 - discountPercent / 100))
    : product?.price;

  const descriptionParts =
    typeof product?.description === "string"
      ? product.description.split("|").map((part) => part.trim())
      : [product?.description];

  return (
    <div>
      {hasDiscount && (
        <span className="block w-fit mb-5 py-2 px-3 bg-blue-500 text-white">
          - {discountPercent}%
        </span>
      )}

      <h2 className="text-5xl font-semibold text-black">{product?.name}</h2>

      {typeof product?.price === "number" && (
        <div className="flex flex-row items-center gap-5">
          {hasDiscount ? (
            <>
              <h4 className="my-5 text-3xl font-light text-gray-300 line-through">
                ₦ {product?.price?.toLocaleString()}
              </h4>
              <h4 className="my-5 text-3xl font-semibold text-blue-500">
                ₦ {finalPrice?.toLocaleString()}
              </h4>
            </>
          ) : (
            <h4 className="my-5 text-3xl font-light text-blue-500">
              ₦ {product?.price?.toLocaleString()}
            </h4>
          )}
        </div>
      )}

      {descriptionParts?.map((part, idx) => (
        <p key={idx} className="text-xl text-gray-700 mb-5">
          {part}
        </p>
      ))}

      <div className="mt-10 flex items-center gap-10">
        {productColors.length > 0 && (
          <CustomSelect
            label="Color"
            options={productColors}
            value={selectedColor}
            onChange={setSelectedColor}
          />
        )}
        {productVariants.length > 0 && (
          <CustomSelect
            label="Variants"
            options={productVariants}
            value={selectedVariant}
            onChange={setSelectedVariant}
          />
        )}
      </div>

      <UtilityButtons
        product={product}
        selectedColor={selectedColor}
        selectedVariant={selectedVariant}
      />

      <div className="mt-10">
        <h5 className="mb-2 text-xl text-black capitalize">
          <strong className="inline-block mr-2 w-40">UID: </strong>
          {product?.product_number}
        </h5>
        <h5 className="mb-2 text-xl text-black capitalize">
          <strong className="inline-block mr-2 w-40">Category: </strong>
          {product?.category || "—"}
        </h5>
        <h5 className="mb-2 text-xl text-black capitalize">
          <strong className="inline-block mr-2 w-40">Brand: </strong>
          {product?.brand_name || "—"}
        </h5>
      </div>
    </div>
  );
};

export default ProductDetailCaption;