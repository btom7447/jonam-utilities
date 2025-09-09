"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function HandymanGigChart({ handyman }) {
  // handyman is the array passed as prop
  const sortedHandymen = [...handyman].sort((a, b) => b.gigs - a.gigs);

  const labels = sortedHandymen.map(h => h.name); // or h.username
  const dataValues = sortedHandymen.map(h => h.gigs);

  const data = {
    labels,
    datasets: [
      {
        label: "Gigs Completed",
        data: dataValues,
        borderColor: "#3C47E2",
        backgroundColor: "rgba(60, 71, 226, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: { beginAtZero: true, stepSize: 1, ticks: { precision: 0 } },
      x: { ticks: { autoSkip: false } },
    },
  };

  return (
    <section className="bg-white rounded-xl p-10 border-1 border-gray-200 w-full h-full flex flex-col">
      <h3 className="text-2xl font-semibold mb-5">Handyman Workload</h3>
      <div className="w-full h-full">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
