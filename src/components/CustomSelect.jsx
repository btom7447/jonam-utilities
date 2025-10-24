"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const CustomSelect = ({
  label = "Select Option",
  options = [],
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const getLabel = (option) => {
    if (!option) return "";
    return typeof option === "string" ? option : option.label ?? "";
  };

  const getValue = (option) => {
    if (!option) return "";
    return typeof option === "string" ? option : option.value ?? "";
  };

  const isSelected = (option) => {
    if (!option) return false;
    if (!value) return false; // <-- prevents undefined.includes()
    return getValue(value) === getValue(option);
  };


  return (
    <div className="relative min-w-40 max-w-160">
      {label && (
        <h5 className="mb-2 text-xl text-black font-semibold capitalize">
          {label}
        </h5>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex gap-10 justify-between items-center p-5 border border-gray-500 bg-transparent text-xl text-left text-black capitalize cursor-pointer"
      >
        {getLabel(value) || `Choose ${label.toLowerCase()}`}
        <ChevronDown size={15} />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full bg-gray-900 border border-gray-900 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <li
              key={getValue(option) || Math.random()} // fallback unique key
              onClick={() => handleSelect(option)}
              className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700 ${
                isSelected(option) ? "bg-blue-500" : ""
              }`}
            >
              {getLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
