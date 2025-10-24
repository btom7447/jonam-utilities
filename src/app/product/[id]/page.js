"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NoProduct from "@/components/NoProduct";
import ProductDetailsSection from "@/components/ProductDetailsSection";
import RelatedProductsSection from "@/components/RelatedProductsSection";
import { DotLoader } from "react-spinners";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!id) return;

      async function fetchProduct() {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) {
            console.error("No product found");
            setProduct(null);
            return;
          }

          const data = await res.json();

          // ✅ Normalize discount to decimal
          let discount = data.discount;
          if (typeof discount === "string" && discount.includes("%")) {
            discount = parseFloat(discount.replace("%", "")) / 100;
          } else if (typeof discount === "number" && discount > 1) {
            discount = discount / 100;
          } else if (!discount) {
            discount = 0;
          }

          setProduct({
            ...data,
            discount,
          });
        } catch (err) {
          console.error("Error loading product:", err);
          setProduct(null);
        } finally {
          setLoading(false);
        }
      }

      fetchProduct();
    }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  if (!product) {
    return <NoProduct />;
  }

  return (
    <div className="px-5 md:px-20 xl:px-30 py-10 xl:py-30 bg-blue-50">
      <ProductDetailsSection product={product} />
      <RelatedProductsSection product={product} />
    </div>
  );
}
