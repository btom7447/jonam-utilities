"use client";

import {
  CalendarDays,
  MapPin,
  Wrench,
  User,
  Phone,
  Mail,
  ClipboardList,
} from "lucide-react";

export default function UserBookingDetails({ booking }) {
  return (
    <div className="bg-white border border-gray-200 p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">
            Booking #{booking?._id || "N/A"}
          </h2>
          <p className="text-gray-600 flex items-center gap-2">
            <CalendarDays size={18} />
            {new Date(booking?.booking_date).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-3 lg:mt-0">
          <span
            className={`px-4 py-1.5 text-sm rounded-full capitalize ${
              booking?.status === "completed"
                ? "bg-green-100 text-green-700"
                : booking?.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : booking?.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {booking?.status || "Pending"}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-4 text-gray-700">
        {/* Left Column */}
        <div className="space-y-3">
          <p className="flex items-center gap-2">
            <User size={18} className="text-gray-500" />
            <strong>Name:</strong> {booking?.customer_name || "N/A"}
          </p>

          <p className="flex items-center gap-2">
            <Phone size={18} className="text-gray-500" />
            <strong>Phone:</strong> {booking?.customer_number || "N/A"}
          </p>

          <p className="flex items-center gap-2">
            <Mail size={18} className="text-gray-500" />
            <strong>Email:</strong> {booking?.customer_email || "N/A"}
          </p>

          <p className="flex items-center gap-2">
            <MapPin size={18} className="text-gray-500" />
            <strong>Address:</strong> {booking?.customer_address || "N/A"}
          </p>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <p className="flex items-center gap-2">
            <Wrench size={18} className="text-gray-500" />
            <strong>Service:</strong> {booking?.service_type || "N/A"}
          </p>

          <p className="flex items-center gap-2">
            <ClipboardList size={18} className="text-gray-500" />
            <strong>Handyman:</strong>{" "}
            {Array.isArray(booking?.handyman_name)
              ? booking.handyman_name.join(", ")
              : booking.handyman_name || "N/A"}
          </p>

          {booking?.additional_notes && (
            <p className="flex items-start gap-2 text-gray-600 leading-relaxed">
              <strong className="font-semibold mt-1">Notes:</strong>{" "}
              {booking.additional_notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
