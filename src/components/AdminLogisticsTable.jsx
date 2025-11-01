"use client";

import { useEffect, useState } from "react";
import { CloudOff, PenLine, ChevronLeft, ChevronRight } from "lucide-react";
import AdminDataUpdate from "./AdminDataUpdate";

export default function AdminLogisticsTable({ data = [], onEdit, updating }) {
  const [tableData, setTableData] = useState([]);
  const [modal, setModal] = useState({ open: false, row: null });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const sorted = [...data].sort((a, b) => a.state.localeCompare(b.state));
    setTableData(sorted);
  }, [data]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const currentData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (row) => setModal({ open: true, row });
  const closeModal = () => setModal({ open: false, row: null });

  const handleUpdate = async ({ _id, values }) => {
    await onEdit?.({ _id, values });
    closeModal();
  };

  if (!tableData.length) {
    return (
      <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl p-20 border border-gray-200 flex flex-col items-center">
        <CloudOff size={40} strokeWidth={1} />
        <p className="mt-5 text-gray-500 text-center text-2xl">
          No logistics data found
        </p>
      </section>
    );
  }

  return (
    <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-brown border-b border-gray-200 text-xl text-left text-white">
            <th className="p-5 font-semibold">#</th>
            <th className="p-5 font-semibold">State</th>
            <th className="p-5 font-semibold">Delivery Price</th>
            <th className="p-5 font-semibold text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((row, idx) => (
            <tr key={row._id} className="hover:bg-gray-50">
              <td className="p-5 border-b border-gray-200">
                {(idx + 1).toString().padStart(2, "0")}
              </td>
              <td className="p-5 border-b border-gray-200 capitalize">
                {row.state}
              </td>
              <td className="p-5 border-b border-gray-200 font-medium">
                ₦{row.price?.toLocaleString()}
              </td>
              <td className="p-5 border-b border-gray-200 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(row);
                  }}
                  className="text-blue-500 hover:text-blue-800 cursor-pointer"
                >
                  <PenLine size={25} strokeWidth={1} />
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
          className="flex items-center gap-1 px-3 py-2 hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronLeft size={30} strokeWidth={1} />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronRight size={30} strokeWidth={1} />
        </button>
      </div>

      {/* Update modal */}
      {modal.open && (
        <AdminDataUpdate
          row={modal.row}
          open={true}
          onClose={closeModal}
          onUpdate={handleUpdate}
          updating={updating}
          mode="update"
          formFields={[
            { name: "state", label: "State", type: "text", disabled: true },
            { name: "price", label: "Delivery Price (₦)", type: "number" },
          ]}
        />
      )}
    </section>
  );
}
