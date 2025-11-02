"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import AdminStaffsTable from "@/components/AdminStaffsTable";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

export default function AdminStaffsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
       const token = await getAuth().currentUser.getIdToken(true); // force refresh
       const res = await fetch("/api/users", {
         headers: { Authorization: `Bearer ${token}` },
       });
        const data = await res.json();
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
  const handleToggleAccess = async (id, currentAccess, role) => {
    if (role === "super-admin") {
      toast.info("Super admin access cannot be changed.");
      return;
    }

    setUpdating(true);
    try {
        const token = await getAuth().currentUser.getIdToken(); 
        const res = await fetch("/api/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, access: !currentAccess }),
        });

      if (!res.ok) throw new Error("Failed to update access");

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, access: !currentAccess } : u))
      );
      toast.success(
        `Access ${!currentAccess ? "enabled" : "disabled"}`
      );
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
        onToggleRole={handleToggleAccess}
        updating={updating}
      />
    </>
  );
}
