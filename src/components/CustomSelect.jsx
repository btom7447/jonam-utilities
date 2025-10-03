"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const CustomSelect = ({ label = "Select Option", options = [], value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Display the label corresponding to the current value
  const selectedLabel = (() => {
    if (typeof value === "boolean" && options.includes("Yes") && options.includes("No")) {
      return value ? "Yes" : "No";
    }
    return options.find(opt => (typeof opt === "object" ? opt.value : opt) === value)?.label || "";
  })();

  const handleSelect = (val) => {
    onChange(val); // Keep generic; conversion handled outside if needed
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-40 max-w-160">
      {label && <h5 className="mb-2 text-xl text-black font-semibold capitalize">{label}</h5>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex gap-10 justify-between items-center p-5 border border-gray-500 bg-transparent text-xl text-left text-black capitalize cursor-pointer"
      >
        {selectedLabel || `Choose ${label.toLowerCase()}`}
        <ChevronDown size={15} />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full max-h-60 overflow-y-auto bg-gray-900 border border-gray-900">
          {options.map((option, idx) => {
  const val = typeof option === "object" ? option.value : option;
  const labelText = typeof option === "object" ? option.label : option;

  return (
    <li
      key={`${val}-${idx}`} // ensures uniqueness
      onClick={() => handleSelect(val)}
      className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700 ${
        value === val ? "bg-blue-500" : ""
      }`}
    >
      {labelText}
    </li>
  );
})}

        </ul>
      )}
    </div>
  );
};

export default CustomSelect;