"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import NoProduct from './NoProduct';
import { DotLoader } from "react-spinners";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css"; 

const MAX_ITEMS = 10;

const RelatedProductsSection = ({ product }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();

                const category = product.category?.[0];
                const brand = product.brand_name?.[0];

                if (!category && !brand) {
                    setFilteredProducts(data.slice(0, MAX_ITEMS));
                    setLoading(false);
                    return;
                }

                const sameCategory = data.filter(
                    (p) => p.id !== product.id && p.category?.[0] === category
                );

                const remaining = MAX_ITEMS - sameCategory.length;

                const sameBrand = data.filter(
                    (p) => p.id !== product.id &&
                    !sameCategory.includes(p) &&
                    p.brand_name?.[0] === brand
                );

                const combined = [...sameCategory, ...sameBrand];
                const stillRemaining = MAX_ITEMS - combined.length;

                const fallback = data.filter(
                    (p) =>
                        p.id !== product.id &&
                        !combined.includes(p)
                );

                // Shuffle fallback before slicing
                const shuffledFallback = fallback.sort(() => 0.5 - Math.random());

                const finalList = [...combined, ...shuffledFallback.slice(0, stillRemaining)];
                setFilteredProducts(finalList.slice(0, MAX_ITEMS));
            } catch (err) {
                console.error("Error loading products:", err);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, [product]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full py-20">
                <DotLoader size={80} color="#8b4513" />
            </div>
        );
    }

    return (
        <section className='mt-10 mb-20 flex flex-col items-start'>
            <h2 className='text-5xl font-semibold text-black'>Related products</h2>

            {filteredProducts.length === 0 ? (
                <NoProduct />
            ) : (
                <Splide
                    options={{
                        type: "loop",
                        perPage: 4,
                        perMove: 1,
                        gap: "30px",
                        autoplay: true,
                        interval: 2200,
                        arrows: true,
                        pagination: false,
                        breakpoints: {
                            1440: { perPage: 4 },
                            1024: { perPage: 3 },
                            768: { perPage: 2 },
                            640: { perPage: 1 },
                        },
                    }}
                    className="w-full px-10"
                >
                    {filteredProducts.map((item) => (
                        <SplideSlide key={item.id}>
                            <ProductCard data={item} />
                        </SplideSlide>
                    ))}
                </Splide>
            )}
        </section>
    );
};

export default RelatedProductsSection;
