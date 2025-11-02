"use client";

import { useState, useEffect } from "react";
import { CloudOff, PenLine, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Switch from "react-switch"; // or use a custom toggle

export default function AdminStaffsTable({
  data = [],
  onToggleRole,
  updating,
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [tableData, setTableData] = useState(Array.isArray(data) ? data : []);
    useEffect(() => {
        setTableData(Array.isArray(data) ? data : []);
    }, [data]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIdx, startIdx + itemsPerPage);

  if (!tableData || tableData.length === 0) {
    return (
      <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl p-20 border border-gray-200 flex flex-col items-center">
        <CloudOff size={40} strokeWidth={1} />
        <p className="mt-5 text-gray-500 text-center text-2xl">
          No staff or admin users found
        </p>
      </section>
    );
  }

  return (
    <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl border border-gray-200 overflow-x-auto relative">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-brown border-b border-gray-200 text-xl text-left text-white">
            <th className="p-5 font-semibold">#</th>
            <th className="p-5 font-semibold">Image</th>
            <th className="p-5 font-semibold">Name</th>
            <th className="p-5 font-semibold">Email</th>
            <th className="p-5 font-semibold">Phone</th>
            <th className="p-5 font-semibold">Role</th>
            <th className="p-5 font-semibold text-right">Admin Access</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((user, idx) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-5 border-b border-gray-200">
                {(startIdx + idx + 1).toString().padStart(2, "0")}
              </td>

              <td className="p-5 border-b border-gray-200">
                <Image
                  src={user.imageUrl || "/fallback.jpg"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border object-top"
                  unoptimized
                />
              </td>

              <td className="p-5 border-b border-gray-200 font-medium">
                {user.name}
              </td>
              <td className="p-5 border-b border-gray-200">{user.email}</td>
              <td className="p-5 border-b border-gray-200">
                {user.phone || "—"}
              </td>
              <td className="p-5 border-b border-gray-200 capitalize">
                {user.role}
              </td>

              <td className="p-5 border-b border-gray-200 text-right">
                <Switch
                  checked={user.access}
                  onChange={() =>
                    onToggleAccess(user.id, user.access, user.role)
                  }
                  disabled={user.role === "super-admin" || updating}
                  onColor="#2563EB"
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-10 p-10">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center gap-1 px-3 py-2 cursor-pointer hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronLeft size={30} strokeWidth={1} />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center gap-1 px-3 py-2 cursor-pointer hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronRight size={30} strokeWidth={1} />
        </button>
      </div>
    </section>
  );
}
