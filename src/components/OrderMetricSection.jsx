"use client";

import { PackageIcon, CheckCircleIcon, ClockIcon, TruckIcon } from "lucide-react";

export default function OrderMetricSection({ orders }) {

    const orderLength = orders.length;

    // Today & yesterday dates
    const today = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const todayOrders = orders.filter(o => o.order_date?.split("T")[0] === today).length;
    const yesterdayOrders = orders.filter(o => o.order_date?.split("T")[0] === yesterdayDate).length;

    // Daily difference
    let dailyDifference = null;
    if (yesterdayOrders > 0 || todayOrders > 0) {
        dailyDifference = todayOrders - yesterdayOrders;
    }

    // Count orders by status
    const completedOrders = orders.filter(o => o.status === "completed").length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const transitOrders = orders.filter(o => o.status === "transit").length;

    const metrics = [
        {
            title: "Total Orders",
            value: orderLength,
            icon: PackageIcon,
            extra: dailyDifference !== null
                ? `${dailyDifference > 0 ? "+" : ""}${dailyDifference}`
                : "—",
            extraColor: dailyDifference !== null
                ? (dailyDifference > 0 ? "text-green-500" : dailyDifference < 0 ? "text-red-500" : "text-gray-400")
                : "text-gray-400",
        },
        {
            title: "Completed Orders",
            value: completedOrders,
            icon: CheckCircleIcon,
        },
        {
            title: "Pending Orders",
            value: pendingOrders,
            icon: ClockIcon,
        },
        {
            title: "In Transit",
            value: transitOrders,
            icon: TruckIcon,
        },
     ];

    return (
        <section className="p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map(({ title, value, icon: Icon, extra, extraColor }) => (
                <div key={title} className="bg-white rounded-xl p-10 border-1 border-blue-500 relative group">
                    <div className="flex items-center justify-center gap-10 text-black group-hover:text-blue-500">
                        <Icon size={30} strokeWidth={1} />
                        <p className="text-lg font-semibold">{title}</p>
                    </div>
                    <h3 className="text-4xl font-semibold text-center mt-3 group-hover:text-blue-500">{value.toLocaleString()}</h3>
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
