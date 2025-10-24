"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import HandymanMetricSection from "@/components/HandymanMetricsSection";
import AdminHandymanTable from "@/components/AdminHandymanTable";

export default function AdminHandymanPage() {
  const [handyman, setHandyman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --- Fetch handyman records ---
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/handyman");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch handymen");

        setHandyman(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching handyman:", err);
        toast.error("Failed to load handyman data");
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

  // --- CREATE or UPDATE handyman record ---
  const handleUpdateHandyman = async ({ _id, values }) => {
    setUpdating(true);

    try {
      const isNew = !_id;
      const method = isNew ? "POST" : "PATCH";
      const url = isNew ? `/api/handyman` : `/api/handyman/${_id}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operation failed");

      if (isNew) {
        setHandyman((prev) => [...prev, data]);
        toast.success("Handyman created successfully!");
      } else {
        setHandyman((prev) =>
          prev.map((o) => (o._id === _id ? { ...o, ...data } : o))
        );
        toast.success("Handyman updated successfully!");
      }
    } catch (err) {
      console.error("Error updating handyman:", err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // --- Delete handyman record ---
  const handleDelete = async (handymanItem) => {
    if (!handymanItem?._id) return toast.error("No ID found for deletion");

    setUpdating(true);
    try {
      const res = await fetch(`/api/handyman/${handymanItem._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete handyman");

      setHandyman((prev) => prev.filter((o) => o._id !== handymanItem._id));
      toast.success("Handyman deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <AdminHeader title="Handyman Management" />
      <HandymanMetricSection handyman={handyman} />
      <AdminHandymanTable
        data={handyman}
        onEdit={handleUpdateHandyman}
        onDelete={handleDelete}
        updating={updating}
      />
    </>
  );
}
