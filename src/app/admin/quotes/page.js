"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import AdminHeader from "@/components/AdminHeader";
import AdminQuotesTable from "@/components/AdminQuotesTable";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch all quotes
  useEffect(() => {
    async function loadQuotes() {
      try {
        const res = await fetch("/api/request-quote");
        const data = await res.json();
        setQuotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    }
    loadQuotes();
  }, []);

  // ✅ Handle status update
  const handleUpdateQuote = async ({ _id, values }) => {
    if (!_id) return toast.error("Missing quote ID");
    setUpdating(true);
    try {
      const res = await fetch(`/api/request-quote/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update quote");

      const updated = await res.json();
      setQuotes((prev) =>
        prev.map((q) => (q._id === _id ? { ...q, ...updated } : q))
      );
      toast.success("Quote updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Handle delete
  const handleDelete = async (quote) => {
    if (!quote?._id) return toast.error("No quote ID found");
    setUpdating(true);
    try {
      const res = await fetch(`/api/request-quote/${quote._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete quote");
      setQuotes((prev) => prev.filter((q) => q._id !== quote._id));
      toast.success("Quote deleted successfully!");
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
      <AdminHeader title="Quote Management" />
      <AdminQuotesTable
        data={quotes}
        onEdit={handleUpdateQuote}
        onDelete={handleDelete}
        updating={updating}
      />
    </>
  );
}
