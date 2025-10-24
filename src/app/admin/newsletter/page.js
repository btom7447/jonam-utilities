"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import AdminHeader from "@/components/AdminHeader";
import AdminNewsletterTable from "@/components/AdminNewsletterTable";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch all subscribers
  useEffect(() => {
    async function loadSubscribers() {
      try {
        const res = await fetch("/api/newsletter");
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching newsletter data:", err);
        setSubscribers([]);
      } finally {
        setLoading(false);
      }
    }
    loadSubscribers();
  }, []);

  // Handle status update
  const handleUpdateSubscriber = async ({ _id, values }) => {
    if (!_id) return toast.error("Missing subscriber ID");
    setUpdating(true);
    try {
      const res = await fetch(`/api/newsletter/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update subscriber");

      const updated = await res.json();
      setSubscribers((prev) =>
        prev.map((s) => (_id === s._id ? { ...s, ...updated } : s))
      );
      toast.success("Subscriber updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Handle delete/unsubscribe
  const handleDeleteSubscriber = async (subscriber) => {
    if (!subscriber?._id) return toast.error("No subscriber ID found");
    setUpdating(true);
    try {
      const res = await fetch(`/api/newsletter/${subscriber._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subscriber");
      setSubscribers((prev) => prev.filter((s) => s._id !== subscriber._id));
      toast.success("Subscriber deleted successfully!");
    } catch (err) {
      toast.error(err.message);
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

  return (
    <>
      <AdminHeader title="Newsletter Management" />
      <AdminNewsletterTable
        data={subscribers}
        onEdit={handleUpdateSubscriber}
        onDelete={handleDeleteSubscriber}
        updating={updating}
      />
    </>
  );
}
