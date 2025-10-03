"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";

import AdminHeader from "@/components/AdminHeader";
import ProductMetricSection from "@/components/ProductMetricSection";
import AdminProductTable from "@/components/AdminProductTable";
import { normalizePayload } from "@/lib/normalizedPayload";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load products, categories, brands
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes, brandRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);

        if (!prodRes.ok || !catRes.ok || !brandRes.ok) throw new Error("Failed to fetch data");

        const [prodData, catData, brandData] = await Promise.all([
          prodRes.json(),
          catRes.json(),
          brandRes.json(),
        ]);

        setProducts(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);
        setBrands(Array.isArray(brandData) ? brandData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load products/categories/brands");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Create or Update product
  const handleSaveProduct = async (row) => {
    setUpdating(true);
    try {
      const payload = normalizeProductPayload(row.values, categories, brands);
      let res, data;

      if (row.create) {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw await res.json();
        data = await res.json();
        setProducts((prev) => [...prev, data]);
        toast.success("Product created successfully!");
      } else {
        if (!row.recordId) return toast.error("Missing record ID");
        res = await fetch(`/api/products/${row.recordId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw await res.json();
        data = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.recordId === row.recordId ? { ...p, ...data } : p))
        );
        toast.success("Product updated successfully!");
      }
    } catch (err) {
      console.error("Save failed:", err);
      toast.error(`Save failed: ${err.error || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Delete product
  const handleDelete = async (product) => {
    if (!product?.recordId) return toast.error("No record ID found");
    setUpdating(true);
    try {
      const res = await fetch(`/api/products/${product.recordId}`, { method: "DELETE" });
      if (!res.ok) throw await res.json();
      setProducts((prev) => prev.filter((p) => p.recordId !== product.recordId));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.error || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }
  // console.log("product page brands", brands);
  // console.log("product page categories", categories)

  return (
    <>
      <AdminHeader title="Products Management" />
      <ProductMetricSection product={products} />
      <AdminProductTable
        data={products}
        onEdit={handleSaveProduct}
        onDelete={handleDelete}
        updating={updating}
        extraOptions={{ categories, brands }}
      />
    </>
  );
}
