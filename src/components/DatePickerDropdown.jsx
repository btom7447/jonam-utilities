"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { format as formatDateFns } from "date-fns";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isBefore,
  isToday,
} from "date-fns";

const DatePickerDropdown = ({ selectedDate, onSelectDate, activeInput, setActiveInput }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    setDays(eachDayOfInterval({ start, end }));
  }, [currentMonth]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveInput(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setActiveInput]);

  const handleDateClick = (day) => {
    if (isBefore(day, new Date()) || isToday(day)) return;

    const formattedDate = formatDateFns(day, "yyyy-MM-dd"); // ✅ Airtable-compatible
    onSelectDate(formattedDate);
    setActiveInput(null);
  };


  const isActive = activeInput === "date";

  return (
    <div className="relative w-full min-w-xs" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setActiveInput(isActive ? null : "date")}
        className={`w-full flex justify-between items-center py-5 px-4 border-b border-gray-500 text-xl bg-transparent cursor-pointer transition-colors duration-300 ${
          selectedDate ? "text-black" : "text-gray-500"
        }`}
      >
        {selectedDate ? format(new Date(selectedDate), "dd/MM/yyyy") : "Pick a Date"}
        <ChevronDown size={20} />
      </button>

      {/* Underline span for active input */}
      <span
        className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
          isActive ? "w-full bg-blue-500" : "w-0 bg-gray-900"
        } group-hover:w-full group-hover:bg-blue-500`}
      ></span>

      {isActive && (
        <div className="absolute z-20 mt-2 w-full bg-gray-900 shadow-lg border border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4 text-white">
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              className="p-1 hover:bg-gray-700 cursor-pointer"
            >
              <ChevronLeft />
            </button>
            <h3 className="font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              className="p-1 hover:bg-gray-700 cursor-pointer"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 select-none">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 mt-1">
            {days.map((day) => {
              const isDisabled = isBefore(day, new Date()) || isToday(day);
              const isSelected = selectedDate === format(day, "dd/MM/yyyy");
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDateClick(day)}
                  className={`p-2 text-sm font-medium transition-colors 
                    ${
                      isDisabled
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white hover:bg-brown cursor-pointer"
                    }
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerDropdown;
