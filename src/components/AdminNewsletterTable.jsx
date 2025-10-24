"use client";

import { useState, useEffect } from "react";
import {
  CloudOff,
  PenLine,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminDataUpdate from "./AdminDataUpdate";

const getStatusStyle = (status) => {
  const normalized = status?.toLowerCase?.();
  switch (normalized) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "subscribed":
      return "bg-green-100 text-green-700 border border-green-300";
    case "unsubscribed":
      return "bg-red-100 text-red-700 border border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

export default function AdminNewsletterTable({
  data = [],
  onEdit,
  onDelete,
  updating,
}) {
  const [tableData, setTableData] = useState(data);
  const [modal, setModal] = useState({ type: null, row: null });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setTableData(data), [data]);

  useEffect(() => {
    // Sort by date (newest first)
    const sortedData = [...data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setTableData(sortedData);
  }, [data]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIdx, startIdx + itemsPerPage);

  const openUpdateModal = (row) => setModal({ type: "update", row });
  const closeModal = () => setModal({ type: null, row: null });

  const handleUpdate = async ({ _id, values }) => {
    await onEdit?.({ _id, values });
    closeModal();
  };

  if (!tableData.length)
    return (
      <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl p-20 border border-gray-200 flex flex-col items-center">
        <CloudOff size={40} strokeWidth={1} />
        <p className="mt-5 text-gray-500 text-center text-2xl">
          No subscribers available
        </p>
      </section>
    );

  return (
    <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-brown text-white text-left">
          <tr>
            <th className="w-16 p-5 font-semibold">#</th>
            <th className="w-auto p-5 font-semibold">Email</th>
            <th className="w-42 p-5 font-semibold">Date</th>
            <th className="w-32 p-5 font-semibold">Status</th>
            <th className="w-32 p-5 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((row, idx) => (
            <tr key={row._id} className="border-b hover:bg-gray-50">
              {/* Auto numbering */}
              <td className="p-5 border-b text-left">
                {(startIdx + idx + 1).toString().padStart(2, "0")}
              </td>{" "}
              <td className="p-5">{row.email_address}</td>
              <td className="p-5">
                {new Date(row.createdAt).toLocaleDateString()}
              </td>
              <td className="p-5">
                <span
                  className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="p-5 text-right">
                <button
                  onClick={() => openUpdateModal(row)}
                  className="text-blue-500 hover:text-blue-800 mr-4 cursor-pointer"
                >
                  <PenLine size={22} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-500 hover:text-red-800 cursor-pointer"
                >
                  <Trash2 size={22} strokeWidth={1.5} />
                </button>
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
        >
          <ChevronLeft size={30} strokeWidth={1} />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={30} strokeWidth={1} />
        </button>
      </div>

      {/* Update Modal */}
      {modal.row && (
        <AdminDataUpdate
          row={modal.row}
          open={true}
          onClose={closeModal}
          onUpdate={handleUpdate}
          loading={false}
          updating={updating}
          mode={modal.type}
          formFields={[
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["pending", "subscribed", "unsubscribed"],
            },
          ]}
        />
      )}
    </section>
  );
}
