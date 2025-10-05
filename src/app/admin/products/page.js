"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import ProductMetricSection from "@/components/ProductMetricSection";
import AdminProductTable from "@/components/AdminProductTable";
import { normalizePayload } from "@/lib/normalizePayload";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- Fetch product records ---
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Fetch Brand & Category records ---
  useEffect(() => {
    async function loadMeta() {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);

        const brandData = await brandRes.json();
        console.log("Brand data", brandData)
        const categoryData = await categoryRes.json();

        setBrands(Array.isArray(brandData) ? brandData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (err) {
        console.error("Error fetching brands/categories:", err);
      }
    }

    loadMeta();
  }, []);
  
  // --- Loader ---
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  // --- Helper: normalize image(s) ---
  const formatImages = (images) => {
    if (!images) return [];
    if (typeof images === "string") return [{ url: images }];
    if (Array.isArray(images)) {
      return images.map((img) =>
        typeof img === "string" ? { url: img } : { url: img.url }
      );
    }
    if (images.url) return [{ url: images.url }];
    return [];
  };

  // --- Create / Update Product ---
  const handleUpdateProduct = async ({ recordId, values }) => {
    setUpdating(true);

    try {
     const payload = normalizePayload(values, {
       numberFields: ["price", "quantity", "product_number", "discount"],
       imageFields: ["image", "images"], // both fields
       selectFields: ["brand_link", "category_link", "featured"], // normalize selects
     });


      if (payload.image) {
        payload.image = formatImages(payload.image);
      }

      let updatedProduct;
      if (!recordId) {
        // CREATE
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        updatedProduct = await res.json();

        setProducts((prev) => [...prev, updatedProduct]);
        toast.success("Product created successfully!");
      } else {
        // UPDATE
        const res = await fetch(`/api/products/${recordId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        updatedProduct = await res.json();

        setProducts((prev) =>
          prev.map((p) =>
            p.recordId === recordId ? { ...p, ...updatedProduct } : p
          )
        );
        toast.success("Product updated successfully!");
      }

      setSelectedProduct(null);
    } catch (err) {
      toast.error(`Operation failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // --- Delete Product ---
  const handleDelete = async (product) => {
    if (!product?.recordId)
      return toast.error("No record ID found for deletion");

    setUpdating(true);
    try {
      const res = await fetch(`/api/products/${product.recordId}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error((await res.json()).error || "Failed to delete product");

      setProducts((prev) =>
        prev.filter((p) => p.recordId !== product.recordId)
      );
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // --- Brand & Category Options ----
  const brandOptions = brands.map((b) => ({
    label: b.name,
    value: b.recordId,
  }));
  const categoryOptions = categories.map((c) => ({
    label: c.caption,
    value: c.id,
  }));

  console.log("Category options", categoryOptions)
  console.log("brand options", brandOptions);
  // console.log("Products", products)


  return (
    <>
      <AdminHeader title="Products Management" />
      <ProductMetricSection product={products} />

      <AdminProductTable
        data={products}
        brandOptions={brandOptions}
        categoryOptions={categoryOptions}
        onEdit={handleUpdateProduct}
        onDelete={handleDelete}
        updating={updating}
      />
    </>
  );
}
