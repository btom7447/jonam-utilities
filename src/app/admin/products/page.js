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
        const categoryData = await categoryRes.json();

        setBrands(Array.isArray(brandData) ? brandData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (err) {
        console.error("Error fetching brands/categories:", err);
      }
    }

    loadMeta();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

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
 const handleUpdateProduct = async ({ _id, values }) => {
   setUpdating(true);

   try {
     const payload = normalizePayload(values, {
       numberFields: ["price", "quantity", "product_number", "discount"],
       imageFields: ["images"],
       selectFields: ["brand_link", "category_link", "featured"],
       textArrayFields: ["variants", "product_colors"],
     });

     // --- convert image(s) format ---
     if (payload.image) {
       payload.image = formatImages(payload.image);
     }

     // ✅ convert featured string to boolean
     payload.featured =
       payload.featured === true ||
       payload.featured === "true" ||
       payload.featured === "1";

     // ✅ ensure discount is a number (not divided by 100)
     if (payload.discount != null) {
       payload.discount = Number(payload.discount);
     }

     // ✅ attach brand and category readable names
     // ✅ attach brand and category readable names
     const brandId = Array.isArray(payload.brand_link)
       ? payload.brand_link[0]
       : payload.brand_link;
     const categoryId = Array.isArray(payload.category_link)
       ? payload.category_link[0]
       : payload.category_link;

     const brand = brands.find((b) => b._id === brandId)?.name || "";
     const category =
       categories.find((c) => c._id === categoryId)?.caption || "";

     payload.brand = brand;
     payload.category = category;

     // --- CREATE or UPDATE request ---
     let updatedProduct;
     if (!_id) {
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
       const res = await fetch(`/api/products/${_id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });
       if (!res.ok) throw new Error((await res.json()).error);
       updatedProduct = await res.json();

       setProducts((prev) =>
         prev.map((p) => (p._id === _id ? { ...p, ...updatedProduct } : p))
       );
       toast.success("Product updated successfully!");
     }
   } catch (err) {
     toast.error(`Operation failed: ${err.message}`);
   } finally {
     setUpdating(false);
   }
 };

  // --- Delete Product ---
  const handleDelete = async (product) => {
    if (!product?._id) return toast.error("No product ID found for deletion");

    setUpdating(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      if (!res.ok)
        throw new Error((await res.json()).error || "Failed to delete product");

      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const brandOptions = brands.map((b) => ({
    label: b.name,
    value: b._id,
  }));

  const categoryOptions = categories.map((c) => ({
    label: c.caption,
    value: c._id,
  }));

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
