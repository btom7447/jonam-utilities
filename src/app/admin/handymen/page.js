"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import HandymanMetricSection from "@/components/HandymanMetricsSection";
import AdminHandymanTable from "@/components/AdminHandymanTable";
import { normalizePayload } from "@/lib/normalizePayload";

export default function AdminHandymanPage() {
  const [handyman, setHandyman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);

  // --- Fetch handyman records ---
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/handyman");
        const data = await res.json();
        setHandyman(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching handyman:", err);
        setHandyman([]);
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

  // --- Helper: normalize image(s) for Airtable ---
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

  // --- Update handyman record ---
  const handleUpdateHandyman = async ({ recordId, values }) => {
    setUpdating(true);

    try {
      // Normalize payload
      const payload = normalizePayload(values, {
        numberFields: ["rating", "gigs"],
        imageFields: ["image"],
      });

      if (payload.availability) {
        const availabilityMap = {
          away: "away",
          available: "available",
          busy: "busy",
        };
        const clean = payload.availability
          .replace(/^"+|"+$/g, "")
          .toLowerCase();
        payload.availability = availabilityMap[clean] || clean;
      }

      let updatedHandyman;
      if (!recordId) {
        // ✅ CREATE
        const res = await fetch(`/api/handyman`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        updatedHandyman = await res.json();

        setHandyman((prev) => [...prev, updatedHandyman]);
        toast.success("Handyman created successfully!");
      } else {
        // ✅ UPDATE
        const res = await fetch(`/api/handyman/${recordId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        updatedHandyman = await res.json();

        setHandyman((prev) =>
          prev.map((o) =>
            o.recordId === recordId ? { ...o, ...updatedHandyman } : o
          )
        );
        toast.success("Handyman updated successfully!");
      }

      setSelectedHandyman(null);
    } catch (err) {
      toast.error(`Operation failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };


  // --- Delete handyman record ---
  const handleDelete = async (handyman) => {
    if (!handyman?.recordId)
      return toast.error("No record ID found for deletion");

    setUpdating(true);
    try {
      const res = await fetch(`/api/handyman/${handyman.recordId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete handyman");
      }

      setHandyman((prev) => prev.filter((o) => o.recordId !== handyman.recordId));
      toast.success("Handyman deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };
  
  console.log("Handyman data", handyman);

  return (
    <>
      <AdminHeader title="Booking Management" />
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
