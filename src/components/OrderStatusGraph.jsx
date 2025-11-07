"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function OrderStatusGraph({ orders }) {
  // Map statuses from enum
  const statuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // Count orders per status
  const counts = statuses.map(
    (status) => orders.filter((o) => o.status === status).length
  );

  // Colors for each status
  const colors = ["#FACC15", "#3C47E2", "#80E3FF", "#10B981", "#EF4444"]; // yellow, blue, light blue, green, red

  const data = {
    labels: statuses.map((s) => s.charAt(0).toUpperCase() + s.slice(1)), // Capitalize
    datasets: [
      {
        label: "Order Status",
        data: counts,
        backgroundColor: colors,
        borderColor: colors,
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

  return (
    <section className="bg-white rounded-xl p-10 border-1 border-gray-200 w-full h-full flex flex-col">
      <h3 className="text-2xl font-semibold mb-5">Order Status</h3>
      <div className="flex flex-wrap items-start justify-start gap-10 h-[70%]">
        {/* Custom Legends */}
        <div className="flex flex-row flex-wrap xl:flex-col justify-center gap-3">
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

        <div className="flex-1 h-50 lg:h-full">
          <Pie data={data} options={options} />
        </div>
      </div>
    </section>
  );
}
