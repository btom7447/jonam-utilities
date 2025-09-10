"use client";

import { CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

function MonthView({ year, month, bookings }) {
    // First & last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    // Format bookings by date
    const bookingsByDate = useMemo(() => {
        const map = {};
        bookings.forEach((b) => {
        const d = new Date(b.booking_date);
            if (d.getMonth() === month && d.getFullYear() === year) {
                const day = d.getDate();
                if (!map[day]) map[day] = [];
                map[day].push(b);
            }
        });
        return map;
    }, [bookings, month, year]);

    // Build days grid
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    const today = new Date();
    const isCurrentMonth =
        today.getMonth() === month && today.getFullYear() === year;

    const monthName = firstDay.toLocaleString("default", { month: "long" });

    return (
        <div className=" flex flex-col">
            <h5 className="mb-3 bg-gray-900 p-3 text-center text-2xl text-white">
                {monthName} - {year}
            </h5>

            {/* Weekdays header */}
            <div className="grid grid-cols-7 gap-3 text-center font-semibold text-gray-700">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="p-2 text-lg">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2 mt-2">
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={`min-h-[50px] text-center p-2 flex flex-col items-center justify-start text-lg 
                        ${day ? "" : ""}
                        ${
                            isCurrentMonth && day === today.getDate()
                            ? "bg-blue-100 text-blue-600 font-bold"
                            : "text-black"
                        }`}
                    >
                        <span>{day || ""}</span>

                        {/* Booking markers */}
                        {day && bookingsByDate[day] && (
                            <div className="flex flex-wrap justify-center gap-1 mt-1">
                                {bookingsByDate[day].map((b, i) => (
                                    <span
                                        key={i}
                                        className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-md"
                                        title={`${b.customer_name} – ${b.service_type}`}
                                    >
                                        <CalendarCheck size={12} />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminBookingCalendar({ bookings }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const prevMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    const nextMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    return (
        <section className="p-5 mx-5 lg:mx-10 mb-10 bg-white rounded-xl border border-gray-200 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-semibold">View Bookings</h3>
                <div className="flex gap-5">
                    <button
                        onClick={prevMonth}
                        className="p-2 text-gray-700 cursor-pointer hover:text-black"
                    >
                        <ChevronLeft size={25} strokeWidth={1} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 text-gray-700 cursor-pointer hover:text-black"
                    >
                        <ChevronRight size={25} strokeWidth={1} />
                    </button>
                </div>
            </div>

            {/* Responsive grid: 2 calendars side by side (desktop), stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <MonthView year={year} month={month} bookings={bookings} />
                <MonthView year={year} month={month + 1} bookings={bookings} />
            </div>
        </section>
    );
}
