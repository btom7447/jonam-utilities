"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import AdminHeader from "@/components/AdminHeader";
import AdminLogisticsTable from "@/components/AdminLogisticsTable";

export default function AdminLogisticsPage() {
  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch all logistics data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/logistics");
        if (!res.ok) throw new Error("Failed to fetch logistics data");
        const data = await res.json();
        setLogistics(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching logistics:", err);
        toast.error("Failed to load logistics data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Update Logistics (only price/status) ---
  const handleUpdateLogistics = async ({ _id, values }) => {
    if (!_id) return toast.error("Missing logistics ID");

    setUpdating(true);
    try {
      const res = await fetch(`/api/logistics/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: Number(values.price),
          status: values.status || "active",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update logistics");
      }

      const updated = await res.json();
      setLogistics((prev) => prev.map((l) => (l._id === _id ? updated : l)));

      toast.success("Logistics updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title="Delivery States & Fees" />
      <AdminLogisticsTable
        data={logistics}
        onEdit={handleUpdateLogistics}
        updating={updating}
      />
    </>
  );
}
