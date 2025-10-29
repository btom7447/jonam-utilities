"use client";

import { useState, useEffect } from "react";
import {
  EllipsisVertical,
  PrinterIcon,
  ShareIcon,
  DownloadIcon,
  PenLine,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminDataUpdate from "./AdminDataUpdate";

// ✅ Status UI helper
const getStatusClasses = (status) => {
  const normalized = String(status || "").toLowerCase();

  switch (normalized) {
    case "completed":
    case "true":
    case "delivered":
      return "bg-green-100 text-green-700 border border-green-300";
    case "confirmed":
      return "bg-orange-100 text-orange-500 border border-orange-500";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "shipped":
    case "false":
      return "bg-blue-100 text-blue-700 border border-blue-300";
    case "cancelled":
    case "draft":
      return "bg-red-100 text-red-700 border border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

export default function AdminOrderTable({
  data = [],
  onEdit,
  onDelete,
  onRowClick,
  updating,
}) {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modal, setModal] = useState({ type: null, row: null });

  useEffect(() => {
    const sorted = [...data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setTableData(sorted);
  }, [data]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIdx, startIdx + itemsPerPage);

  const openUpdateModal = (row) => setModal({ type: "update", row });
  const closeModal = () => setModal({ type: null, row: null });

  const handleUpdate = async ({ _id, values }) => {
    const updated = await onEdit?.({ _id, values });
    if (updated) {
      setTableData((prev) => prev.map((r) => (r._id === _id ? updated : r)));
    }
    closeModal();
  };

  if (!tableData.length) {
    return (
      <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl p-20 border flex flex-col items-center text-gray-500">
        <p className="text-2xl">No orders available</p>
      </section>
    );
  }

  return (
    <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl border border-gray-200 overflow-x-auto relative">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-brown text-white text-left text-lg">
            <th className="p-5">#</th>
            <th className="p-5">Customer</th>
            <th className="p-5">Phone</th>
            <th className="p-5">Total</th>
            <th className="p-5">Payment</th>
            <th className="p-5">Status</th>
            <th className="p-5 text-right relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="cursor-pointer"
              >
                <EllipsisVertical size={25} strokeWidth={1} />
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-5 w-fit flex flex-col items-center bg-white border rounded-xl shadow-lg z-50">
                  <li
                    onClick={() => window.print()}
                    className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200 cursor-pointer"
                  >
                    <PrinterIcon size={20} />
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
                      a.download = "orders-data.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 border-b cursor-pointer"
                  >
                    <DownloadIcon size={20} />
                  </li>
                  <li
                    onClick={async () => {
                      if (navigator.share) {
                        await navigator.share({
                          title: "Admin Orders Data",
                          text: "Order list",
                          url: window.location.href,
                        });
                      } else alert("Sharing not supported");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <ShareIcon size={20} />
                  </li>
                </ul>
              )}
            </th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((row, idx) => (
            <tr
              key={row._id || idx}
              onClick={() => onRowClick?.(row)}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="p-5 border-b border-gray-200 text-left">
                {(startIdx + idx + 1).toString().padStart(2, "0")}
              </td>
              <td className="p-5 border-b border-gray-200">
                <div>
                  <p className="font-medium">{row.customer_name}</p>
                  <p className="text-sm text-gray-500">{row.customer_email}</p>
                </div>
              </td>
              <td className="p-5 border-b border-gray-200">
                {row.customer_number}
              </td>
              <td className="p-5 border-b border-gray-200">
                ₦ {row.order_total.toLocaleString()}
              </td>
              <td className="p-5 border-b border-gray-200">
                {row.payment_option}
              </td>
              <td className="p-5 border-b border-gray-200">
                <span
                  className={`px-5 py-2 rounded-full text-sm font-medium capitalize ${getStatusClasses(
                    row.status
                  )}`}
                >
                  {row.status || "unknown"}
                </span>
              </td>
              <td className="p-5 border-b border-gray-200 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openUpdateModal(row);
                  }}
                  className="text-blue-500 hover:text-blue-800 mr-5"
                >
                  <PenLine size={22} strokeWidth={1} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(row);
                  }}
                  className="text-red-500 hover:text-red-800 hidden"
                >
                  <Trash2 size={22} strokeWidth={1} />
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
          className="px-3 py-2 cursor-pointer hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronLeft size={25} />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 cursor-pointer hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronRight size={25} />
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
            {
              name: "status",
              label: "Status",
              type: "select",
              options: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
              ],
            },
          ]}
        />
      )}
    </section>
  );
}
