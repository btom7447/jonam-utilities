"use client";

import React, { useState } from 'react'
import UtilityButtons from './UtilityButtons';
import CustomSelect from './CustomSelect';

const ProductDetailCaption = ({ product }) => {
    const [selectedColor, setSelectedColor] = useState(product.product_colors?.[0] || "");
    const [selectedVariant, setSelectedVarient] = useState(product.variants?.[0] || "");
    console.log("product data", product)

    let discountPercent = null;
    let finalPrice = product.price;

    if (typeof product.discount === "number" && product.discount > 0 && product.discount < 1) {
        discountPercent = Math.round(product.discount * 100); // e.g. 0.03 -> 3%
        finalPrice = Math.round(product.price * (1 - product.discount));
    }

    // Split the description by "|" and trim each part
    const descriptionParts = typeof product.description === "string"
        ? product.description.split("|").map(part => part.trim())
        : [product.description];

    return (
        <div className=''>
            {product.discount > 0 && (
                <span className='block w-fit mb-5 py-2 px-3 bg-blue-500 text-white'>
                    - {discountPercent}%
                </span>
            )}
            <h2 className='text-5xl font-semibold text-black'>{product.name}</h2>
            {typeof product.price === "number" && (
                <div className='flex flex-row items-center gap-5'>
                    {product.discount > 0 && product.discount < 1 ? (
                        <>
                            <h4 className='my-5 text-3xl font-medium text-gray-300 line-through'>
                                ₦ {product.price.toLocaleString()}
                            </h4>
                            <h4 className='my-5 text-3xl font-medium text-blue-500'>
                                ₦ {finalPrice.toLocaleString()}
                            </h4>
                        </>
                    ) : (
                        <h4 className='my-5 text-3xl font-medium text-blue-500'>
                            ₦ {product.price.toLocaleString()}
                        </h4>
                    )}
                </div>
            )}
            {descriptionParts.map((part, idx) => (
                <p key={idx} className='text-xl text-gray-700  mb-5'>{part}</p>
            ))}
            
            <div className="mt-10 flex items-center gap-10 ">
                {product.product_colors && (
                    <CustomSelect 
                        label="Color"
                        options={product.product_colors}
                        value={selectedColor}
                        onChange={setSelectedColor}            
                    />
                )}
                {product.variants && (
                    <CustomSelect 
                        label="Variants"
                        options={product.variants}
                        value={selectedVariant}
                        onChange={setSelectedVarient}            
                    />
                )}
            </div>

            <UtilityButtons 
                product={product}
                selectedColor={selectedColor}
                selectedVariant={selectedVariant} 
            />

            <div className='mt-10'>
                <h5 className='mb-2 text-xl text-black capitalize'>
                    <strong className='inline-block mr-2 w-40'>UID: </strong>
                    {product.product_number}
                </h5>
                <h5 className='mb-2 text-xl text-black capitalize'>
                    <strong className='inline-block mr-2 w-40'>Category: </strong>
                    {product.category}
                </h5>
                <h5 className='mb-2 text-xl text-black capitalize'>
                    <strong className='inline-block mr-2 w-40'>Brand: </strong>
                    {product.brand_name}
                </h5>


            </div>
        </div>
    )
}

export default ProductDetailCaption