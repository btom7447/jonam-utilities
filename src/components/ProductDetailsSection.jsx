"use client";

import NoProduct from "./NoProduct";
import ProductDetailCaption from "./ProductDetailCaption";
import ProductGallery from "./ProductGallery";

export default function ProductDetailsSection({ product }) {
    if (!product) return (
        <NoProduct />  
    )

    return (
        <section className="w-full grid grid-cols-1 xl:grid-cols-2 items-start gap-10">
            <ProductGallery product={product} />
            <ProductDetailCaption product={product} />
        </section>
    );
}
