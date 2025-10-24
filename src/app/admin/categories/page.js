"use client";

import { useEffect, useState } from "react";
import { DotLoader, MoonLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import AdminCategoriesTable from "@/components/AdminCategoriesTable";
import { normalizePayload } from "@/lib/normalizePayload";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- Fetch all categories ---
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Fetch all products ---
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

  // --- Loader ---
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  // --- Helper: format images ---
  const formatImages = (images) => {
    if (!images) return [];
    if (typeof images === "string") return [{ url: images }];
    if (Array.isArray(images))
      return images.map((img) =>
        typeof img === "string" ? { url: img } : { url: img.url }
      );
    if (images.url) return [{ url: images.url }];
    return [];
  };

  // --- Create or Update Category ---
  const handleUpdateCategory = async ({ _id, values }) => {
    setUpdating(true);
    try {
      const payload = normalizePayload(values, {
        numberFields: [],
        imageFields: ["images"],
        selectFields: ["status"],
      });

      if (payload.image) payload.image = formatImages(payload.image);
      if (payload.images) payload.images = formatImages(payload.images);

      let res, updatedCategory;

      if (_id) {
        // ✅ UPDATE
        res = await fetch(`/api/categories/${_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // ✅ CREATE
        res = await fetch(`/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error((await res.json()).error);
      updatedCategory = await res.json();

      // Update state
      setCategories((prev) => {
        if (_id) {
          return prev.map((c) => (c._id === _id ? updatedCategory : c));
        } else {
          return [...prev, updatedCategory];
        }
      });

      toast.success(
        _id
          ? "Category updated successfully!"
          : "Category created successfully!"
      );
      setSelectedCategory(null);
    } catch (err) {
      toast.error(`Operation failed: ${err.message}`);
      console.error("Update category failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  // --- Delete Category ---
  const handleDelete = async (category) => {
    if (!category?._id) return toast.error("No ID found for deletion");

    setUpdating(true);
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((o) => o._id !== category._id));
      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  console.log("Categories data", categories);

  return (
    <>
      <AdminHeader title="Categories Management" />
      <AdminCategoriesTable
        data={categories}
        onEdit={handleUpdateCategory}
        onDelete={handleDelete}
        updating={updating}
      />
    </>
  );
}
