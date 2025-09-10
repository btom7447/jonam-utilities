"use client";

import { XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import { MoonLoader } from "react-spinners";

export default function StatusUpdate({
  row,
  field,
  fieldOptions,
  open,
  onClose,
  onUpdate,
  onDelete,
  loading,
  mode = "update", // "update" | "delete"
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (row && field && mode === "update") setValue(row[field] || "");
  }, [row, field, mode]);

  if (!open || !row) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onUpdate) return;
    await onUpdate({ recordId: row.recordId, field, value });
    onClose();
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    await onDelete(row);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-lg">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl capitalize font-semibold">
            {mode === "delete" ? "Confirm Deletion" : `Update ${field.replace("_", " ")} Record`}
          </h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-800 hover:cursor-pointer font-bold">
            <XIcon size={25} strokeWidth={2} />
          </button>
        </div>

        {mode === "delete" ? (
          <div className="space-y-10">
            <p className="text-xl">Are you sure you want to delete this order?</p>
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="py-3 px-10 text-gray-500 cursor-pointer  border border-gray-500 hover:bg-gray-500 hover:text-white">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className={`py-3 px-10 text-xl flex items-center justify-center
                ${!loading ? "cursor-pointer bg-red-500 hover:bg-red-600" : "cursor-not-allowed bg-red-500"} 
                text-white transition-all duration-300`}
              >
                {loading ? <MoonLoader size={25} color="#fff" /> : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="flex ">
              <CustomSelect
                label={field.replace("_", " ")}
                options={fieldOptions?.[field]?.map(opt => opt.value) || []}
                value={value}
                onChange={setValue}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="py-3 px-10 text-red-500 cursor-pointer  border border-red-500 hover:bg-red-500 hover:text-white">Cancel</button>
              <button
                type="submit"
                disabled={loading}
                className={`py-3 px-10 text-xl flex items-center justify-center
                ${!loading ? "bg-blue-500 hover:bg-brown cursor-pointer" : "bg-gray-500 cursor-not-allowed"} 
                text-white transition-all duration-300`}
              >
                {loading ? <MoonLoader size={25} color="#fff" /> : "Update"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
