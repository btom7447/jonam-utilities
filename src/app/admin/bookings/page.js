"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import AdminHeader from "@/components/AdminHeader";
import BookingMetricSection from "@/components/BookingMetricSection";
import AdminBookingCalendar from "@/components/AdminBookingCalendar";
import AdminBookingTable from "@/components/AdminBookingTable";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetch("/api/book-handyman");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const handleUpdateBooking = async ({ _id, values }) => {
    if (!_id) return toast.error("Missing booking ID");
    setUpdating(true);
    try {
      const res = await fetch(`/api/book-handyman/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b._id === _id ? { ...b, ...updated } : b))
      );
      toast.success("Booking updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (booking) => {
    if (!booking?._id) return toast.error("No booking ID found");
    setUpdating(true);
    try {
      const res = await fetch(`/api/book-handyman/${booking._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings((prev) => prev.filter((b) => b._id !== booking._id));
      toast.success("Booking deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title="Booking Management" />
      <BookingMetricSection bookings={bookings} />
      <AdminBookingTable
        data={bookings}
        onEdit={handleUpdateBooking}
        onDelete={handleDelete}
        updating={updating}
      />
      <AdminBookingCalendar bookings={bookings} />
    </>
  );
}
