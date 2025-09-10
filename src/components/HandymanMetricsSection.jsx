"use client";

import { HardHatIcon, UserRoundCheck, UserRoundX, UserCog2Icon } from "lucide-react";

export default function HandymanMetricSection({ handyman }) {

    const handymanLength = handyman.length;

    // Count orders by status
    const activeHandymen = handyman.filter(o => o.availability === "available").length;
    const awayHandymen = handyman.filter(o => o.availability === "away").length;
    const bookedHandymen = handyman.filter(o => o.availability === "booked").length;

    const metrics = [
        {
            title: "Handymen",
            value: handymanLength,
            icon: HardHatIcon,
        },
        {
            title: "Active Handymen",
            value: activeHandymen,
            icon: UserRoundCheck,
        },
        {
            title: "Booked Handymen",
            value: bookedHandymen,
            icon: UserCog2Icon,
        },
        {
            title: "Unavailable Handymen",
            value: awayHandymen,
            icon: UserRoundX,
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
