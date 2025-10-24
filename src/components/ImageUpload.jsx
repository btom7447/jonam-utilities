"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import Image from "next/image";

export default function ImageUploader({
  images = [],
  setImages,
  label = "Upload Images",
  multiple = true,
}) {
  const [uploading, setUploading] = useState(false);

  // Normalize images to always be an array (like your AdminDataUpdate)
  const normalizedImages = Array.isArray(images) ? images : [];

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadedImages = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Upload failed");

        // ✅ Use the same format as your AdminDataUpdate: [{ url: data.url }]
        uploadedImages.push({ url: data.url });
      }

      // ✅ Update parent state with the same array format
      if (multiple) {
        setImages([...normalizedImages, ...uploadedImages]);
      } else {
        // For single image, replace with new array
        setImages(uploadedImages);
      }

      toast.success(
        `Successfully uploaded ${uploadedImages.length} image${
          uploadedImages.length > 1 ? "s" : ""
        }`
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(normalizedImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="">
      {/* Label */}
      <label className="block text-xl font-semibold text-gray-800 mb-2">
        {label}
      </label>
      {/* Uploading Loader - Same style as your example */}
      {uploading && (
        <div className="py-10 flex items-center justify-start">
          <MoonLoader size={25} color="#1d4ed8" />
        </div>
      )}

      {/* Image Previews - Similar to your single preview but for multiple */}
      {normalizedImages.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-3">
            {normalizedImages.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  width={120}
                  height={120}
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="mb-3 w-30 h-30 object-cover rounded-lg border"
                  unoptimized={image.url?.includes("cloudinary")}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="cursor-pointer absolute top-0 right-0 bg-black/70 text-white p-1 rounded-full hover:bg-black/90"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Input - Same as your example */}
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full border border-gray-700 p-5 focus:outline-none cursor-pointer"
      />
    </div>
  );
}
