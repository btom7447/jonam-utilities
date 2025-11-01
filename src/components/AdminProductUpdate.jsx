"use client";

import { XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import { MoonLoader } from "react-spinners";
import ImageUploader from "./ImageUpload";

export default function AdminProductUpdate({
  row,
  fieldOptions = {},
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

  // ✅ Initialize form values from the row data
  useEffect(() => {
    if (row) {
      const initialValues = {};

      formFields.forEach((f) => {
        let val = row[f.name] ?? "";

        // ✅ Handle linked fields (brand & category)
        if (f.name === "brand_link" || f.name === "category_link") {
          if (Array.isArray(val)) {
            const first = val[0];
            val =
              fieldOptions[f.name]?.find((opt) => opt.value === first) ||
              (first ? { label: first, value: first } : null);
          } else if (typeof val === "string") {
            val = fieldOptions[f.name]?.find((opt) => opt.value === val) || {
              label: val,
              value: val,
            };
          } else {
            val = null;
          }
        }

        // ✅ Handle featured select
        if (f.name === "featured" && val !== undefined) {
          if (typeof val === "boolean") {
            val = val
              ? { label: "True", value: "true" }
              : { label: "False", value: "false" };
          } else if (typeof val === "string") {
            val = { label: val, value: val.toLowerCase() };
          }
        }

        // ✅ Convert array fields to comma-separated text for display
        if (
          Array.isArray(val) &&
          (f.name === "variants" || f.name === "product_colors")
        ) {
          val = val.join(", ");
        }

        // ✅ Ensure file fields are arrays
        if (f.type === "file") {
          val = Array.isArray(val) ? val : [];
        }

        initialValues[f.name] = val;
      });

      setValues(initialValues);
    }
  }, [row, formFields, fieldOptions]);

  if (!open || !row) return null;

  const handleChange = (name, val) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onUpdate) return;

    const payload = { ...values };

    // ✅ Convert selects to single values
    ["brand_link", "category_link"].forEach((field) => {
      payload[field] = payload[field]?.value || null;
    });

    // ✅ Featured → string
    if (payload.featured !== undefined) {
      if (typeof payload.featured === "object") {
        payload.featured = payload.featured.value || "false";
      } else {
        payload.featured = String(payload.featured).toLowerCase();
      }
    }

    // ✅ Discount → decimal for Airtable
    if (payload.discount != null) {
      payload.discount = Number(payload.discount);
    }

    // ✅ Convert variants/colors back to arrays
    ["variants", "product_colors"].forEach((field) => {
      if (payload[field] && typeof payload[field] === "string") {
        payload[field] = payload[field]
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    });

    await onUpdate({ recordId: row.recordId, values: payload });
    onClose();
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    await onDelete(row);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 p-5">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl capitalize font-semibold">
            {mode === "delete"
              ? "Confirm Deletion"
              : mode === "create"
              ? "Create Product"
              : "Update Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-800 hover:cursor-pointer font-bold"
          >
            <XIcon size={25} strokeWidth={2} />
          </button>
        </div>

        {/* Delete Mode */}
        {mode === "delete" ? (
          <div className="space-y-10">
            <p className="text-xl">
              Are you sure you want to delete this product?
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
                className={`py-3 px-10 text-xl flex items-center justify-center ${
                  !loading
                    ? "cursor-pointer bg-red-500 hover:bg-red-600"
                    : "cursor-not-allowed bg-red-500"
                } text-white transition-all duration-300`}
              >
                {loading ? <MoonLoader size={25} color="#fff" /> : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          // Form Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {formFields.map((field) => {
                const isFullSpan = field.name === "description";

                // ✅ Select Fields
                if (
                  field.type === "select" &&
                  (field.name === "brand_link" ||
                    field.name === "category_link" ||
                    field.name === "featured") &&
                  fieldOptions[field.name]
                ) {
                  return (
                    <div
                      key={field.name}
                      className={`flex flex-col justify-end ${
                        isFullSpan ? "col-span-2" : ""
                      }`}
                    >
                      <CustomSelect
                        label={field.label}
                        options={fieldOptions[field.name]}
                        value={values[field.name]}
                        onChange={(val) => handleChange(field.name, val)}
                      />
                    </div>
                  );
                }

                // ✅ File Upload
                if (field.type === "file") {
                  return (
                    <div
                      key={field.name}
                      className={`flex flex-col justify-end ${
                        isFullSpan ? "col-span-2" : ""
                      }`}
                    >
                      <ImageUploader
                        images={values[field.name]}
                        setImages={(imgs) => handleChange(field.name, imgs)}
                        label={field.label}
                        multiple={true}
                      />
                    </div>
                  );
                }

                // ✅ Textarea
                if (field.type === "textarea") {
                  return (
                    <div
                      key={field.name}
                      className={`flex flex-col justify-end ${
                        isFullSpan ? "col-span-2" : ""
                      }`}
                    >
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
                    </div>
                  );
                }

                // ✅ Variants & Colors
                if (
                  field.name === "variants" ||
                  field.name === "product_colors"
                ) {
                  return (
                    <div
                      key={field.name}
                      className={`flex flex-col justify-end ${
                        isFullSpan ? "col-span-2" : ""
                      }`}
                    >
                      <label className="mb-2 text-xl font-semibold">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={values[field.name]}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        placeholder="Comma separated values"
                        className="border border-gray-700 p-5 focus:outline-none"
                      />
                    </div>
                  );
                }

                // ✅ Default Input
                return (
                  <div
                    key={field.name}
                    className={`flex flex-col justify-end ${
                      isFullSpan ? "col-span-2" : ""
                    }`}
                  >
                    <label className="mb-2 text-xl font-semibold">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      value={values[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="border border-gray-700 p-5 focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>

            {/* ✅ Form Buttons */}
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
                className={`py-3 px-10 text-xl flex items-center justify-center ${
                  !updating && !uploading
                    ? "bg-blue-500 hover:bg-brown cursor-pointer"
                    : "bg-gray-500 cursor-not-allowed"
                } text-white transition-all duration-300`}
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
