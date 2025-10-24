"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { DotLoader } from "react-spinners";
import Link from "next/link";
import NoProduct from "./NoProduct";

const FeaturedProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?featured=true", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const result = await res.json();

        // Normalize data structure depending on backend response
        const data = Array.isArray(result) ? result : result.data || [];

        const featured = data
          .filter((item) => item.featured === true) // ✅ boolean comparison
          .slice(0, 8);

        setProducts(featured);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center bg-blue-50 px-5 md:px-20 py-20">
      <h5 className="text-xl md:text-2xl text-black uppercase font-semibold mb-5">
        Our Catalog
      </h5>
      <h2 className="text-3xl md:text-7xl text-black text-center font-bold max-w-full md:max-w-5xl">
        Featured Products
      </h2>

      {products.length === 0 ? (
        <NoProduct />
      ) : (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20 justify-center mt-10">
            {products.map((product, idx) => (
              <div
                key={product._id || idx}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
                data-aos-duration="600"
              >
                <ProductCard data={product} />
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center mt-20">
            <Link
              href="/shop"
              className="py-5 px-10 bg-blue-500 text-white text-xl hover:bg-brown cursor-pointer"
            >
              View More Products
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedProductSection;