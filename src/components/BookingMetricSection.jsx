"use client";

import { CalendarClockIcon, CalendarDaysIcon,CalendarCheckIcon, CalendarSyncIcon } from "lucide-react";

export default function BookingMetricSection({ bookings }) {

    const bookingLength = bookings.length;

    // Today & yesterday dates
    const today = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const todaysBookings = bookings.filter(o => o.booking_date?.split("T")[0] === today).length;
    const yesterdaysBookings = bookings.filter(o => o.booking_date?.split("T")[0] === yesterdayDate).length;

    // Daily difference
    let dailyDifference = null;
    if (yesterdaysBookings > 0 || todaysBookings > 0) {
        dailyDifference = todaysBookings - yesterdaysBookings;
    }

    // Count orders by status
    const completedBookings = bookings.filter(o => o.status === "completed").length;
    const pendingBookings = bookings.filter(o => o.status === "pending").length;
    const activeBookings = bookings.filter(o => o.status === "confirmed").length;

    const metrics = [
        {
            title: "Total Bookings",
            value: bookingLength,
            icon: CalendarDaysIcon,
            extra: dailyDifference !== null
                ? `${dailyDifference > 0 ? "+" : ""}${dailyDifference}`
                : "—",
            extraColor: dailyDifference !== null
                ? (dailyDifference > 0 ? "text-green-500" : dailyDifference < 0 ? "text-red-500" : "text-gray-400")
                : "text-gray-400",
        },
        {
            title: "Active Bookings",
            value: completedBookings,
            icon: CalendarSyncIcon,
        },
        {
            title: "Pending Bookings",
            value: pendingBookings,
            icon: CalendarClockIcon,
        },
        {
            title: "Completed Bookings",
            value: activeBookings,
            icon: CalendarCheckIcon,
        },
     ];

    return (
        <section className="p-5 lg:p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map(({ title, value, icon: Icon, extra, extraColor }) => (
                <div key={title} className="p-5 bg-white rounded-xl border-1 border-blue-500 relative group">
                    <div className="flex items-center justify-center gap-10 text-black group-hover:text-blue-500">
                        <Icon size={30} strokeWidth={1} />
                        <p className="text-lg font-semibold">{title}</p>
                    </div>
                    <h3 className="text-4xl font-semibold text-center mt-3 group-hover:text-blue-500">{value}</h3>
                    {extra && (
                        <span className={`text-lg absolute bottom-10 right-10 font-medium ${extraColor}`}>
                            {extra}
                        </span>
                    )}
                </div>
            ))}
        </section>
    );
}
