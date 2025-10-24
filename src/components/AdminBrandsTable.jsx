"use client";

import { useState, useEffect } from "react";
import {
  CloudOff,
  EllipsisVertical,
  PenLine,
  PrinterIcon,
  ShareIcon,
  DownloadIcon,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import AdminDataUpdate from "./AdminDataUpdate";

export default function AdminBrandsTable({
  data = [],
  onEdit,
  onDelete,
  updating,
}) {
  const [tableData, setTableData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, row: null });
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => setTimestamp(`?t=${Date.now()}`), []);

  // Sort alphabetically on initial load
  useEffect(() => {
    if (Array.isArray(data)) {
      const sorted = [...data].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
      setTableData(sorted);
    } else setTableData([]);
  }, [data]);

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
        _id: null,
        name: "",
        status: "draft",
        image: [],
        product_links: "",
      },
    });
  };

  const handleUpdate = async ({ _id, values }) => {
    const updated = await onEdit?.({ _id, values });
    if (updated) {
      setTableData((prev) =>
        _id
          ? prev.map((r) => (r._id === _id ? updated : r))
          : [...prev, updated]
      );
    }
    closeModal();
  };

  if (!tableData || tableData.length === 0) {
    return (
      <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl p-20 border border-gray-200 flex flex-col items-center">
        <CloudOff size={40} strokeWidth={1} />
        <p className="mt-5 text-gray-500 text-center text-2xl">
          No brands available
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
            <th className="p-5 font-semibold">Products</th>
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
            </th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((row, idx) => {
            // Count product links (comma-separated numbers)
            const productCount = row.product_links
              ? row.product_links.split(",").filter((n) => n.trim() !== "")
                  .length
              : 0;

            return (
              <tr
                key={row._id || idx}
                className="hover:bg-gray-50 p-5 transition-colors cursor-pointer"
              >
                {/* Auto numbering */}
                <td className="p-5 border-b border-gray-200 text-left">
                  {(startIdx + idx + 1).toString().padStart(2, "0")}
                </td>
                
                <td className="p-5 border-b border-gray-200">
                  {row.image?.[0]?.url ? (
                    <Image
                      src={`${row.image[0].url}${timestamp}`}
                      alt={row.name}
                      width={48}
                      height={48}
                      unoptimized
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  ) : (
                    <Image
                      src="/fallback.jpg"
                      alt={row.name}
                      width={48}
                      height={48}
                      unoptimized
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="p-5 border-b border-gray-200 text-gray-900">
                  {row.name}
                </td>
                <td className="p-5 border-b border-gray-200 text-gray-900">
                  {productCount}
                </td>
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
                <td className="p-5 border-b border-gray-200 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openUpdateModal(row);
                    }}
                    className="text-blue-500 hover:text-blue-800 mr-5 cursor-pointer"
                  >
                    <PenLine size={25} strokeWidth={1} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(row);
                    }}
                    className="text-red-500 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 size={25} strokeWidth={1} />
                  </button>
                </td>
              </tr>
            );
          })}
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
            { name: "image", label: "Brand Logo", type: "file" },
            { name: "name", label: "Brand Name", type: "text" },
            // { name: "product_links", label: "Product Links", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["draft", "publish"],
            },
          ]}
        />
      )}
    </section>
  );
}
