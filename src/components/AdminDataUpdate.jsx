"use client";

import { XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import { MoonLoader } from "react-spinners";
import ImageUploader from "./ImageUpload";

export default function AdminDataUpdate({
  row,
  fieldOptions,
  open,
  onClose,
  onUpdate,
  onDelete,
  loading,
  updating,
  mode = "update",
  formFields = [],
}) {
  const [values, setValues] = useState({});
  const [uploading, setUploading] = useState(false);

  // Initialize form values
  useEffect(() => {
    if (row) {
      const initialValues = {};
      formFields.forEach((f) => {
        let val = row[f.name] ?? "";
        if (f.type === "date" && val) {
          // Convert "Thu Oct 09 2025 01:00:00 GMT+0100..." → "2025-10-09"
          const d = new Date(val);
          if (!isNaN(d)) {
            val = d.toISOString().split("T")[0];
          }
        }
        initialValues[f.name] = val;
      });
      setValues(initialValues);
    }
  }, [row, formFields, mode]);


  if (!open || !row) return null;

  const handleChange = (name, val) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!onUpdate) return;
   await onUpdate({
     _id: row._id, // <-- use _id here
     values,
   });
   onClose();
 };


  const handleDelete = async () => {
    if (!onDelete) return;
    await onDelete(row);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 p-5">
      <div className="bg-white rounded-xl shadow-lg p-8 pb-20 w-full max-w-5xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl capitalize font-semibold">
            {mode === "delete"
              ? "Confirm Deletion"
              : mode === "create"
              ? "Create Record"
              : "Update Record"}
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-800 hover:cursor-pointer font-bold"
          >
            <XIcon size={25} strokeWidth={2} />
          </button>
        </div>

        {mode === "delete" ? (
          <div className="space-y-10">
            <p className="text-xl">
              Are you sure you want to delete this record?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="py-3 px-10 text-gray-500 cursor-pointer border border-gray-500 hover:bg-gray-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className={`py-3 px-10 text-xl flex items-center justify-center
                  ${
                    !loading
                      ? "cursor-pointer bg-red-500 hover:bg-red-600"
                      : "cursor-not-allowed bg-red-500"
                  } 
                  text-white transition-all duration-300`}
              >
                {loading ? <MoonLoader size={25} color="#fff" /> : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={`flex flex-col justify-end ${
                    field.type === "textarea" ? "col-span-2" : ""
                  }`}
                >
                  {field.type === "select" ? (
                    <CustomSelect
                      label={field.label}
                      options={
                        field.options || fieldOptions?.[field.name] || []
                      }
                      value={values[field.name] ?? ""} // <-- ensure it's never undefined
                      onChange={(val) => handleChange(field.name, val)}
                    />
                  ) : field.type === "textarea" ? (
                    <>
                      <label className="mb-3 text-xl font-semibold">
                        {field.label}
                      </label>
                      <textarea
                        value={values[field.name]}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className="border border-gray-700 p-5 h-32 resize-none focus:outline-none"
                      />
                    </>
                  ) : field.type === "file" ? (
                    <ImageUploader
                      images={values[field.name] || []}
                      setImages={(imgs) => handleChange(field.name, imgs)}
                      label={field.label}
                      multiple={field.multiple !== false}
                    />
                  ) : (
                    <>
                      <label className="mb-2 text-xl font-semibold">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        value={values[field.name]}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className="border border-gray-700 p-5 focus:outline-none"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-10 text-red-500 cursor-pointer border border-red-500 hover:bg-red-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating || uploading}
                className={`py-3 px-10 text-xl flex items-center justify-center
                  ${
                    !updating && !uploading
                      ? "bg-blue-500 hover:bg-brown cursor-pointer"
                      : "bg-gray-500 cursor-not-allowed"
                  } 
                  text-white transition-all duration-300`}
              >
                {updating || uploading ? (
                  <MoonLoader size={25} color="#fff" />
                ) : mode === "create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}