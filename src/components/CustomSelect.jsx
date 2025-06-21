"use client";

import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

const CustomSelect = ({ label = "Select Option", options = [], value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-40 max-w-60">
      {label && <h5 className="mb-2 text-xl text-black font-semibold capitalize">{label}</h5>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex gap-10 justify-baseline items-center p-5 border border-gray-500 bg-transparent text-xl text-left text-black capitalize cursor-pointer"
      >
        {value || `Choose ${label.toLowerCase()}`}
        <ChevronDown size={15} />
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-gray-900 border border-gray-900">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700 ${
                value === option ? 'bg-blue-500' : ''
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;