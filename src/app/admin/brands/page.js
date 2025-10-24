"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import AdminBrandsTable from "@/components/AdminBrandsTable";
import { toast } from "react-toastify";
import { normalizePayload } from "@/lib/normalizePayload";

export default function AdminBrandPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --- Fetch all brands ---
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();
        setBrands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
    if (Array.isArray(images))
      return images.map((img) =>
        typeof img === "string" ? { url: img } : { url: img.url }
      );
    if (images.url) return [{ url: images.url }];
    return [];
  };

  // --- Create or Update Brand ---
  const handleUpdateBrand = async ({ _id, values }) => {
    setUpdating(true);
    try {
      const payload = normalizePayload(values, {
        numberFields: [],
        imageFields: ["image"],
        selectFields: ["status"],
      });

      if (payload.image) payload.image = formatImages(payload.image);

      let res;
      if (_id) {
        // UPDATE
        res = await fetch(`/api/brands/${_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error((await res.json()).error);

      const updatedBrand = await res.json();
      setBrands((prev) =>
        _id
          ? prev.map((b) => (b._id === _id ? updatedBrand : b))
          : [...prev, updatedBrand]
      );

      toast.success(_id ? "Brand updated!" : "Brand created!");
    } catch (err) {
      toast.error(`Operation failed: ${err.message}`);
      console.error("Update brand failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  // --- Delete Brand ---
  const handleDelete = async (brand) => {
    if (!brand?._id) return toast.error("No ID found for deletion");

    setUpdating(true);
    try {
      const res = await fetch(`/api/brands/${brand._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");

      setBrands((prev) => prev.filter((b) => b._id !== brand._id));
      toast.success("Brand deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <AdminHeader title="Brands Management" />
      <AdminBrandsTable
        data={brands}
        onEdit={handleUpdateBrand}
        onDelete={handleDelete}
        updating={updating}
      />
    </>
  );
}
