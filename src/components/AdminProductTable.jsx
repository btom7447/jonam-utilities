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
  Trash2,
} from "lucide-react";
import Image from "next/image";
import AdminProductUpdate from "./AdminProductUpdate";

export default function AdminProductTable({
  data = [],
  brandOptions, 
  categoryOptions,
  onEdit,
  onDelete,
  updating,
}) {
  const [tableData, setTableData] = useState(data);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, row: null });
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setTimestamp(`?t=${Date.now()}`);
  }, []);

  useEffect(() => {
    // Sort alphabetically by name
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
    setTableData(sortedData); // sync with parent
  }, [data]);


  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIdx, startIdx + itemsPerPage);

  const openUpdateModal = (row) => setModal({ type: "update", row });
  const openCreateModal = () =>
    setModal({
      type: "create",
      row: {
        recordId: null,
        images: [],
        name: "",
        price: "",
        discount: "",
        quantity: "",
        featured: "false",
      },
    });
  const closeModal = () => setModal({ type: null, row: null });

  const handleUpdate = async ({ recordId, values }) => {
    if (!values) return;
    // normalize image field
    if (values.images && typeof values.images === "string") {
      values.images = [{ url: values.images }];
    }

    const payload = { ...values };

    if (modal.type === "create") {
      await onEdit?.({ recordId: null, values: payload });
    } else {
      await onEdit?.({ recordId, values: payload });
    }
    closeModal();
  };

  if (!tableData || tableData.length === 0) {
    return (
      <section className="mx-5 lg:mx-10 mb-10 bg-white rounded-xl p-20 border border-gray-200 flex flex-col items-center">
        <CloudOff size={40} strokeWidth={1} />
        <p className="mt-5 text-gray-500 text-center text-2xl">
          No data available
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
            <th className="p-5 font-semibold">Price</th>
            <th className="p-5 font-semibold">Discount</th>
            <th className="p-5 font-semibold">Quantity</th>
            <th className="p-5 font-semibold">Featured</th>
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
                      a.download = "products-data.json";
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
                          title: "Admin Products Data",
                          text: "Check out this data",
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
              <td className="p-5 border-b border-gray-200 text-left">
                {row.id}
              </td>
              <td className="p-5 border-b border-gray-200 text-left">
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
              <td className="p-5 border-b border-gray-200 text-left">
                {row.name}
              </td>
              <td className="p-5 border-b border-gray-200 text-left">
                {typeof row.price === "number"
                  ? `₦${row.price.toLocaleString()}`
                  : "N/A"}
              </td>
              <td className="p-5 border-b border-gray-200 text-left">
                {row.discount != null
                  ? `${(row.discount * 100).toFixed(0)}%`
                  : "—"}
              </td>
              <td className="p-5 border-b border-gray-200 text-left">
                {row.quantity ?? 0}
              </td>
              <td className="p-5 border-b border-gray-200 text-left">
                <span
                  className={`px-5 py-2 rounded-full text-sm font-medium ${
                    row.featured === "true"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  }`}
                >
                  {row.featured}
                </span>
              </td>
              <td className="p-5 border-b border-gray-200 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openUpdateModal(row);
                  }}
                  className="text-blue-500 hover:text-blue-800 hover:cursor-pointer mr-5"
                >
                  <PenLine size={25} strokeWidth={1} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(row);
                  }}
                  className="text-red-500 hover:text-red-800 hover:cursor-pointer"
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

      {/* Modal */}
      {modal.row && (
        <AdminProductUpdate
          row={modal.row}
          // brandOptions={brandOptions}
          // categoryOptions={categoryOptions}
          open={true}
          onClose={closeModal}
          onUpdate={handleUpdate}
          onDelete={onDelete}
          loading={false}
          updating={updating}
          mode={modal.type} // create or update
          fieldOptions={{
            brand_link: brandOptions,
            category_link: categoryOptions,
            featured: [
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ],
          }}
          formFields={[
            { name: "images", label: "Image", type: "file" },
            { name: "name", label: "Name", type: "text" },
            { name: "product_number", label: "Product Number", type: "number" },
            { name: "price", label: "Price", type: "number" },
            { name: "discount", label: "Discount", type: "number" },
            { name: "quantity", label: "Quantity", type: "number" },
            {
              name: "featured",
              label: "Featured",
              type: "select",
              options: ["Yes", "No"],
            },
            { name: "variants", label: "Variants", type: "text" },
            { name: "product_colors", label: "Product Colors", type: "text" },
            {
              name: "category_link",
              label: "Cateogry",
              type: "select",
              options: ["Yes", "No"],
            },
            {
              name: "brand_link",
              label: "Brand",
              type: "select",
              options: ["Yes", "No"],
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
            },
          ]}
        />
      )}
    </section>
  );
}
