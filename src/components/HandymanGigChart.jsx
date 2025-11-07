"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function HandymanStatusChart({ handymen = [] }) {
  // fallback to empty array to prevent filter errors

  // Generate past 7 days including today
  const getPastWeek = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
    }
    return days;
  };

  const weekLabels = getPastWeek();

  // Options for statuses
  const statuses = ["available", "away", "booked"];

  // Count handymen per status per day
  const countsByStatus = statuses.map((status) =>
    weekLabels.map(
      (day) =>
        handymen.filter(
          (h) =>
            h.availability === status &&
            (!h.updated_at ||
              new Date(h.updated_at) <= new Date(day + "T23:59:59"))
        ).length
    )
  );

  const colors = {
    available: "#3C47E2",
    away: "#F59E0B",
    booked: "#10B981",
  };

  const data = {
    labels: weekLabels.map((d) =>
      new Date(d).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: statuses.map((status, idx) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      data: countsByStatus[idx],
      borderColor: colors[status],
      backgroundColor: colors[status] + "33", // semi-transparent fill
      tension: 0.3,
      fill: true,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { ticks: { autoSkip: false } },
    },
  };

  return (
    <section className="bg-white rounded-xl p-10 border-1 border-gray-200 w-full h-full flex flex-col">
      <h3 className="text-2xl font-semibold mb-5">
        Weekly Handyman Availability
      </h3>
      <div className="w-full h-full">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
