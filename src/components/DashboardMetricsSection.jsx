import { CheckCircleIcon,  ShoppingCartIcon, HardHatIcon, CalendarIcon } from "lucide-react";

export default function DashboardMetricsSection({ completedOrders, totalProducts, totalHandymen, pendingBookings }) {
    
    const metrics = [
        {
            title: "Pending Orders",
            value: completedOrders,
            icon: CheckCircleIcon,
        },
        {
            title: "Total Products",
            value: totalProducts,
            icon: ShoppingCartIcon,
        },
        {
            title: "Total Handymen",
            value: totalHandymen,
            icon: HardHatIcon,
        },
        {
            title: "Pending Bookings",
            value: pendingBookings,
            icon: CalendarIcon,
        },
     ];

    return (
        <section className="p-5 lg:p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map(({ title, value, icon: Icon, extra, extraColor }) => (
                <div key={title} className="bg-white rounded-xl p-5 border-1 border-blue-500 relative group">
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
