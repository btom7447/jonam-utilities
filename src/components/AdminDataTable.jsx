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
} from "lucide-react";
import StatusUpdate from "./StatusUpdate";

const formatColumnLabel = (col) =>
  col.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const getStatusStyle = (status) => {
  const normalized = status?.toLowerCase?.();
  switch (normalized) {
    case "completed":
      return "bg-green-100 text-green-700 border border-green-300";
    case "confirmed":
      return "bg-orange-100 text-orange-500 border border-orange-500";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "transit":
      return "bg-blue-100 text-blue-700 border border-blue-300";
    case "cancelled":
      return "bg-red-100 text-red-700 border border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

const DATE_KEYWORDS = ["date", "created", "updated", "timestamp"];

export default function AdminDataTable({ data = [], columns = [], onEdit, onDelete, fieldOptions }) {
  const [tableData, setTableData] = useState(data);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalField, setModalField] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState({
    type: null, // "update" | "delete" | null
    row: null,
    field: null,
  });

  // Update modal
  const openUpdateModal = (row, field) => {
    setModal({ type: "update", row, field });
  };

  // Delete modal
  const openDeleteModal = (row) => {
    setModal({ type: "delete", row, field: null });
  };

  const closeModal = () => setModal({ type: null, row: null, field: null });


  useEffect(() => {
    setTableData(data); // sync if parent data changes
  }, [data]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIdx, startIdx + itemsPerPage);

  const formatValue = (col, value) => {
    if (!value) return "-";
    const lowerCol = col.toLowerCase();
    if (["order_total", "price", "total_price"].includes(lowerCol)) return `₦${Number(value).toLocaleString()}`;
    if (DATE_KEYWORDS.some((keyword) => lowerCol.includes(keyword))) {
      const date = new Date(value);
      return isNaN(date) ? value : date.toLocaleDateString();
    }
    return value;
  };

  const openModal = (row, field) => {
    setLoading(true);
    setSelectedRow(row);
    setModalField(field);
    setShowModal(true);
    setLoading(false);
  };

  const handleUpdate = async ({ recordId, field, value }) => {
    setLoading(true);
    await onEdit?.({ recordId, status: value }); // call parent API

    // Update local table instantly
    setTableData((prev) =>
      prev.map((r) => (r.recordId === recordId ? { ...r, [field]: value } : r))
    );

    setLoading(false);
    setShowModal(false);
  };

  if (!tableData || tableData.length === 0) {
    return (
      <section className="m-5 lg:m-10 bg-white rounded-xl p-20 border border-blue-500 flex flex-col items-center ">
        <CloudOff size={40} strokeWidth={1} />
        <p className="mt-5 text-gray-500 text-center text-2xl">No data available</p>
      </section>
    );
  }

  return (
    <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl border border-gray-200 overflow-x-auto relative">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-brown border-b border-gray-200 text-xl text-left text-white">
            {columns.map((col) => (
              <th key={col} className="p-5 font-semibold">{formatColumnLabel(col)}</th>
            ))}
            <th className="p-5 border-b font-semibold text-right relative">
              <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <EllipsisVertical size={25} strokeWidth={1} />
              </button>
              {dropdownOpen && (
                <ul className="absolute right-0 mt-5 w-fit flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <li onClick={() => window.print()} className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200 cursor-pointer text-gray-700">
                    <PrinterIcon size={25} strokeWidth={1} />
                  </li>
                  <li onClick={() => {
                    const blob = new Blob([JSON.stringify(tableData, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "table-data.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }} className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200 cursor-pointer text-gray-700">
                    <DownloadIcon size={25} strokeWidth={1} />
                  </li>
                  <li onClick={async () => {
                    if (navigator.share) {
                      await navigator.share({ title: "Admin Table Data", text: "Check out this data", url: window.location.href });
                    } else alert("Sharing not supported");
                  }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700">
                    <ShareIcon size={25} strokeWidth={1} />
                  </li>
                </ul>
              )}
            </th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={row.recordId || rowIndex} className="hover:bg-gray-50 p-5 transition-colors cursor-pointer">
              {columns.map((col) => {
                const lowerCol = col.toLowerCase();
                const value = row[lowerCol] ?? "-";

                return (
                  <td key={col} className="p-5 border-b border-gray-200 text-left text-gray-900">
                    {fieldOptions?.[lowerCol] ? (
                      <span
                        onClick={() => openModal(row, lowerCol)}
                        className={`px-5 py-3 rounded-full text-sm font-medium cursor-pointer ${
                          lowerCol === "status" ? getStatusStyle(value) : "bg-gray-100 text-gray-700 border border-gray-300"
                        }`}
                      >
                        {value || "-"}
                      </span>
                    ) : lowerCol === "status" ? (
                      <span className={`px-5 py-3 rounded-full text-sm font-medium ${getStatusStyle(value)}`}>{value}</span>
                    ) : (
                      formatValue(col, value)
                    )}
                  </td>
                );
              })}
              <td className="p-5 border-b border-gray-200 text-center relative">
                <button onClick={(e) => { e.stopPropagation(); openUpdateModal(row, "status") }} className="text-blue-500 hover:text-blue-800 hover:cursor-pointer mr-7">
                  <PenLine size={25} strokeWidth={1} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); openDeleteModal(row); }} className="text-red-500 hover:text-red-800 hover:cursor-pointer">
                  <DeleteIcon size={25} strokeWidth={1} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end items-center gap-10 p-10">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center justify-center gap-1 px-3 py-2 cursor-pointer hover:text-gray-700 disabled:opacity-50">
          <ChevronLeft size={30} strokeWidth={1} />
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center justify-center gap-1 px-3 py-2 cursor-pointer hover:text-gray-700 disabled:opacity-50">
          <ChevronRight size={30} strokeWidth={1} />
        </button>
      </div>

      {modal.type && modal.row && (
        <StatusUpdate
          row={modal.row}
          field={modal.field}
          fieldOptions={fieldOptions}
          open={true}
          loading={loading || updating}
          onClose={closeModal}
          onUpdate={handleUpdate}
          onDelete={onDelete}
          mode={modal.type}
        />
      )}

    </section>
  );
}
