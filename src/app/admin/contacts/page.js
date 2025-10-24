"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import AdminHeader from "@/components/AdminHeader";
import AdminContactTable from "@/components/AdminContactTable";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadContacts() {
      try {
        const res = await fetch("/api/contact-form");
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    }
    loadContacts();
  }, []);

  const handleUpdateContact = async ({ _id, values }) => {
    if (!_id) return toast.error("Missing contact ID");
    setUpdating(true);
    try {
      const res = await fetch(`/api/contact-form/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update contact");

      const updated = await res.json();
      setContacts((prev) =>
        prev.map((c) => (c._id === _id ? { ...c, ...updated } : c))
      );
      toast.success("Contact updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (contact) => {
    if (!contact?._id) return toast.error("No contact ID found");
    setUpdating(true);
    try {
      const res = await fetch(`/api/contact-form/${contact._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete contact");
      setContacts((prev) => prev.filter((c) => c._id !== contact._id));
      toast.success("Contact deleted successfully!");
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
      <AdminHeader title="Contact Management" />
      <AdminContactTable
        data={contacts}
        onEdit={handleUpdateContact}
        onDelete={handleDelete}
        updating={updating}
      />
    </>
  );
}
