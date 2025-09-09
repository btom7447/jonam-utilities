"use client";

import { CalendarCheck } from "lucide-react";
import { useMemo } from "react";

export default function BookingCalendar({ bookings }) {
    // Get current date details
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = Jan, 1 = Feb...

    // First & last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Days in this month
    const daysInMonth = lastDay.getDate();

    // Weekday offset for the 1st day (0 = Sunday)
    const startDay = firstDay.getDay();

    // Format bookings by date
    const bookingsByDate = useMemo(() => {
        const map = {};
        bookings.forEach((b) => {
            const date = new Date(b.booking_date).getDate();
            if (!map[date]) map[date] = [];
            map[date].push(b);
        });
        return map;
    }, [bookings]);

    // Build days grid
    const days = [];
    for (let i = 0; i < startDay; i++) {
        days.push(null); // empty slots
    }
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(d);
    }

    const monthName = today.toLocaleString("default", { month: "long" });

    return (
        <section className="bg-white rounded-xl p-10 border border-gray-200 w-full h-full flex flex-col">
            <h3 className="text-2xl font-semibold mb-5">Bookings</h3>
            <h5 className="mb-3 bg-gray-900 p-3 text-center text-2xl text-white">
                {monthName} - {year}
            </h5>

            <div className="grid grid-cols-7 gap-3 text-center font-semibold text-gray-700">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="p-2 text-lg">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-3 mt-2">
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={`min-h-[50px] text-center p-2 flex flex-col items-center justify-start text-lg ${
                        day === today.getDate() ? "bg-blue-100 text-blue-600 font-bold" : "text-black"
                        }`}
                    >
                        <span>{day || ""}</span>

                        {/* Balloon icons for bookings */}
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
        </section>
    );
}
