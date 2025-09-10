"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import ProductMetricSection from "@/components/ProductMetricSection";
import AdminProductTable from "@/components/AdminProductTable";

export default function AdminBookingsPage() {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDeleteClick = (product) => {
        setDeleteTarget(product);
        setDeleteModalOpen(true);
    };

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProduct(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setProduct([]);
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

    const handleRowClick = (product) => {
        // order now includes recordId
        setSelectedProduct(product);
    };

const handleUpdateProduct = async (updatedRow) => {
  setUpdating(true);
  try {
    if (!updatedRow?.recordId) {
      toast.error("RecordId is missing from payload");
      setUpdating(false);
      return;
    }

    const payload = { ...updatedRow.values };

    if (payload.image && typeof payload.image === "string") {
      payload.image = [{ url: payload.image }];
    }

    const res = await fetch(`/api/products/${updatedRow.recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update products");
    }

    const updatedProduct = await res.json();

    setProduct(prev =>
      prev.map(o =>
        o.recordId === updatedRow.recordId
          ? { ...o, ...updatedProduct }
          : o
      )
    );

    toast.success("Product record updated successfully!");
    setSelectedProduct(null);
  } catch (err) {
    console.error("Error updating product:", err);
    toast.error(`Update failed: ${err.message}`);
  } finally {
    setUpdating(false);
  }
};



    const handleDelete = async (product) => {
        if (!product?.recordId) return toast.error("No record ID found for deletion");

        setUpdating(true); // optional: disables buttons while deleting
        try {
            const res = await fetch(`/api/products/${product.recordId}`, { method: "DELETE" });

            if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to delete handyman");
            }

            // Remove from local state so both table and metrics update instantly
            setProduct(prev => prev.filter(o => o.recordId !== product.recordId));

            toast.success("Product deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error(`Delete failed: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };


    console.log("Products", product)
    return (
        <>
            <AdminHeader title="Products Management" />
            <ProductMetricSection product={product} />

            <AdminProductTable
                data={product}
                onEdit={handleUpdateProduct}
                onDelete={handleDelete}
            />
        </>
    );
}
