"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "src/components/AdminHeader";
import AdminStaffsTable from "src/components/AdminStaffTable";
import { toast } from "react-toastify";

export default function AdminStaffsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
const data = await res.json();
console.log("Fetched users:", data); // <== Add this
setUsers(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Handle role toggle
  const handleToggleRole = async (id, currentRole) => {
    if (currentRole === "super-admin") {
      toast.info("Super admin access cannot be changed.");
      return;
    }

    const newRole = currentRole === "staff" ? "user" : "staff";
    setUpdating(true);

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );

      toast.success(`User role changed to ${newRole}`);
    } catch (err) {
      console.error(err);
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
      <AdminHeader title="Staff Management" />
      <AdminStaffsTable
        data={users}
        onToggleRole={handleToggleRole}
        updating={updating}
      />
    </>
  );
}
