"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard';
import NoCategories from './NoCategories';
import { DotLoader } from "react-spinners";
import Link from 'next/link';
import NoProduct from './NoProduct';

const NewProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        async function loadProducts() {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("Products not array:", data);
                setProducts([]);
            } else {
                setProducts(data);
            }
            setLoading(false);
        }

        loadProducts();
    }, []);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000); // 10 seconds timeout

        return () => clearTimeout(timeout);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full py-20">
                <DotLoader size={80} color="#8b4513" />
            </div>
        );
    }

    return (
        <section className='flex flex-col items-center justify-center bg-blue-50 px-5 md:px-20 py-20'>
            <h5 className="text-xl md:text-2xl text-black uppercase font-semibold mb-5">
                Our Catalog
            </h5>
            <h2 className="text-3xl md:text-7xl text-black text-center font-bold max-w-full md:max-w-5xl">
                New Products
            </h2>
            {products.length === 0 ? (
                <NoProduct />
            ) : (
                <>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20 justify-center mt-10">
                        {products.slice(0, 8).map((product, idx) => (
                            <div
                                key={product.recordId}
                                data-aos="fade-up"
                                data-aos-delay={idx * 150}
                                data-aos-duration="600"
                            >
                                <ProductCard data={product} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-center mt-20">
                        <Link href="/shop" className='py-5 px-10 bg-blue-500 text-white text-xl hover:bg-brown cursor-pointer'>
                            View More Products
                        </Link>
                    </div>
                </>
            )}
        </section>
    )
}

export default NewProductsSection