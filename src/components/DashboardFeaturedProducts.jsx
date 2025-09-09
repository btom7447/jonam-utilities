"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function DashboardFeaturedProducts({ featuredProducts }) {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setTimestamp(`?t=${Date.now()}`);
  }, []);

  return (
    <section className="bg-white rounded-xl p-10 border-1 border-gray-200 w-full h-full flex flex-col">
      <h3 className="text-2xl font-semibold mb-5">Featured Products</h3>
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
        {featuredProducts.map((product) => {
          const price = product?.price ?? 0;
          const discount = product?.discount ?? 0;

          let finalPrice = price;
          let hasDiscount = false;

          if (typeof discount === "number" && discount > 0 && discount < 1) {
            hasDiscount = true;
            finalPrice = Math.round(price * (1 - discount));
          }

          return (
            <div
              className="w-full flex flex-col bg-white relative"
              key={product.recordId}
            >
              {product?.images?.[0]?.url && (
                <div className="relative h-[100px] w-full">
                  <Image
                    src={`${product.images[0].url}${timestamp}`}
                    alt={`${product?.caption ?? product?.name ?? "Product"} thumbnail`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              <h5 className="w-full text-lg lg:text-xl font-semibold text-black capitalize hover:text-blue-500 mt-2">
                {product?.name ?? "Untitled Product"}
              </h5>

              {hasDiscount ? (
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
          );
        })}
      </div>
    </section>
  );
}
