"use client";

import NoProduct from "./NoProduct";
import ProductGallery from "./ProductGallery";

export default function ProductDetailsSection({ product }) {
    console.log("product data", product)
    if (!product) return (
        <NoProduct />  
    )

    return (
        <section className="w-full grid grid-cols-1 xl:grid-cols-2 items-start gap-30">
            <ProductGallery product={product} />
            <div>text</div>
        </section>
    );
}
