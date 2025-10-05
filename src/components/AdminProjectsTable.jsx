"use client";

import { useState, useEffect } from "react";
import {
  CloudOff,
  DeleteIcon,
  EllipsisVertical,
  PenLine,
  PrinterIcon,
  ShareIcon,
  DownloadIcon,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import AdminDataUpdate from "./AdminDataUpdate";

export default function AdminProjectsTable({
  data = [],
  onEdit,
  onDelete,
  updating,
}) {
  const [tableData, setTableData] = useState(data);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, row: null });
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => setTimestamp(`?t=${Date.now()}`), []);
  useEffect(() => setTableData(data), [data]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIdx, startIdx + itemsPerPage);

  const openUpdateModal = (row) => setModal({ type: "update", row });
  const openDeleteModal = (row) => setModal({ type: "delete", row });
  const closeModal = () => setModal({ type: null, row: null });

  const openCreateModal = () => {
    setModal({
      type: "create",
      row: {
        recordId: null,
        name: "",
        client_name: "",
        description: "",
        client_review: "",
        client_rating: 0,
        date: new Date().toISOString().split("T")[0],
        status: "draft",
        images: [],
      },
    });
  };

  const handleUpdate = async ({ recordId, field, value, values }) => {
    const payload = values || { [field]: value };

    if (modal.type === "create") {
      const created = await onEdit?.({ recordId: null, values: payload });
      if (created) setTableData((prev) => [...prev, created]);
    } else {
      const updated = await onEdit?.({ recordId, values: payload });
      if (updated) {
        setTableData((prev) =>
          prev.map((r) => (r.recordId === recordId ? { ...r, ...updated } : r))
        );
      }
    }
    closeModal();
  };

  if (!tableData || tableData.length === 0) {
    return (
      <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl p-20 border border-gray-200 flex flex-col items-center">
        <CloudOff size={40} strokeWidth={1} />
        <p className="mt-5 text-gray-500 text-center text-2xl">
          No projects available
        </p>
      </section>
    );
  }

  return (
    <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl border border-gray-200 overflow-x-auto relative">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-brown border-b border-gray-200 text-xl text-left text-white">
            <th className="p-5 font-semibold">Id</th>
            <th className="p-5 font-semibold">Image</th>
            <th className="p-5 font-semibold">Name</th>
            <th className="p-5 font-semibold">Client</th>
            <th className="p-5 font-semibold">Rating</th>
            <th className="p-5 font-semibold">Date</th>
            <th className="p-5 font-semibold">Status</th>
            <th className="p-5 font-semibold text-right relative">
              <div className="flex items-center justify-end gap-5">
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="text-white cursor-pointer"
                >
                  <PlusIcon size={25} strokeWidth={1} />
                </button>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="cursor-pointer"
                >
                  <EllipsisVertical size={25} strokeWidth={1} />
                </button>
              </div>
              {dropdownOpen && (
                <ul className="absolute right-0 mt-5 w-fit flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <li
                    onClick={() => window.print()}
                    className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200 cursor-pointer text-gray-700"
                  >
                    <PrinterIcon size={25} strokeWidth={1} />
                  </li>
                  <li
                    onClick={() => {
                      const blob = new Blob(
                        [JSON.stringify(tableData, null, 2)],
                        { type: "application/json" }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "projects-data.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200 cursor-pointer text-gray-700"
                  >
                    <DownloadIcon size={25} strokeWidth={1} />
                  </li>
                  <li
                    onClick={async () => {
                      if (navigator.share) {
                        await navigator.share({
                          title: "Admin Projects Data",
                          text: "Check out this project data",
                          url: window.location.href,
                        });
                      } else alert("Sharing not supported");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    <ShareIcon size={25} strokeWidth={1} />
                  </li>
                </ul>
              )}
            </th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((row, idx) => (
            <tr
              key={row.recordId || idx}
              className="hover:bg-gray-50 p-5 transition-colors cursor-pointer"
            >
              <td className="p-5 border-b border-gray-200">{row.id}</td>

              {/* Image */}
              <td className="p-5 border-b border-gray-200">
                {row.images?.[0]?.url ? (
                  <Image
                    src={`${row.images[0].url}${timestamp}`}
                    alt={row.name}
                    width={48}
                    height={48}
                    unoptimized
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border text-gray-500">
                    N/A
                  </div>
                )}
              </td>

              {/* Name */}
              <td className="p-5 border-b border-gray-200 text-gray-900">
                {row.name}
              </td>

              {/* Client */}
              <td className="p-5 border-b border-gray-200 text-gray-700">
                {row.client_name || "N/A"}
              </td>

              {/* Rating */}
              <td className="p-5 border-b border-gray-200 text-yellow-500">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < (row.client_rating || 0) ? "gold" : "none"}
                      stroke="currentColor"
                    />
                  ))}
                </div>
              </td>

              {/* Date */}
              <td className="p-5 border-b border-gray-200 text-gray-700">
                {row.date ? new Date(row.date).toLocaleDateString() : "N/A"}
              </td>

              {/* Status */}
              <td className="p-5 border-b border-gray-200">
                <span
                  className={`px-5 py-2 rounded-full text-sm font-medium ${
                    row.status === "publish"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {row.status || "draft"}
                </span>
              </td>

              {/* Actions */}
              <td className="p-5 border-b border-gray-200 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openUpdateModal(row);
                  }}
                  className="text-blue-500 hover:text-blue-800 mr-5"
                >
                  <PenLine size={25} strokeWidth={1} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(row);
                  }}
                  className="text-red-500 hover:text-red-800"
                >
                  <Trash2 size={25} strokeWidth={1} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-10 p-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center gap-1 px-3 py-2 cursor-pointer hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronLeft size={30} strokeWidth={1} />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="flex items-center justify-center gap-1 px-3 py-2 cursor-pointer hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronRight size={30} strokeWidth={1} />
        </button>
      </div>

      {/* Create/Update Modal */}
      {modal.row && (
        <AdminDataUpdate
          row={modal.row}
          open={true}
          onClose={closeModal}
          onUpdate={handleUpdate}
          onDelete={onDelete}
          loading={false}
          updating={updating}
          mode={modal.type}
          formFields={[
            { name: "images", label: "Images", type: "file" },
            { name: "name", label: "Project Name", type: "text" },
            { name: "client_name", label: "Client Name", type: "text" },
            { name: "client_rating", label: "Client Rating", type: "number" },
            { name: "date", label: "Date", type: "date" },
            {
              name: "featured",
              label: "Feature",
              type: "select",
              options: ["false", "true"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["draft", "publish"],
            },
            { name: "description", label: "Description", type: "textarea" },
            { name: "client_review", label: "Client Review", type: "textarea" },
          ]}
        />
      )}
    </section>
  );
}
