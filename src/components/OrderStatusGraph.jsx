"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function OrderStatusGraph({ orders }) {
    // Count orders by status
    const completed = orders.filter(o => o.status === "completed").length;
    const pending = orders.filter(o => o.status === "pending").length;
    const inTransit = orders.filter(o => o.status === "transit").length;

    const data = {
        labels: ["Completed", "Pending", "In Transit"],
        datasets: [
            {
                label: "Order Status",
                data: [completed, pending, inTransit],
                backgroundColor: [
                    "#3C47E2", // completed
                    "#763CE2", // pending
                    "#80E3FF", // transit
                ],
                borderColor: [
                    "#3C47E2", // completed
                    "#763CE2", // pending
                    "#80E3FF", // transit
                ],
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false, // disable default legend
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const colors = ["#3C47E2", "#763CE2", "#80E3FF",];

    return (
        <section className="bg-white rounded-xl p-10 border-1 border-gray-200 w-full h-full flex flex-col">
            <h3 className="text-2xl font-semibold mb-5">Order Status</h3>
            <div className="flex flex-wrap items-start justify-start gap-10 h-[70%]">
                {/* Custom Legends */}
                <div className="flex flex-col justify-center gap-3">
                    {data.labels.map((label, index) => (
                        <div key={label} className="flex items-center gap-2">
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: colors[index] }}
                            ></span>
                            <span className="text-gray-700">{label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex-1  h-50 lg:h-full">
                    <Pie data={data} options={options} />
                </div>
            </div>
        </section>
    );
}
