"use client";

import { useEffect, useState } from "react";
import OrderMetricSection from "@/components/OrderMetricSection";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import AdminDataTable from "@/components/AdminDataTable";
import OrderTableDetails from "@/components/StatusUpdate";
import { toast } from "react-toastify";
import BookingMetricSection from "@/components/BookingMetricSection";
import AdminBookingCalendar from "@/components/AdminBookingCalendar";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false)
    const [selectedBookings, setSelectedBookings] = useState(null); 
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDeleteClick = (booking) => {
        setDeleteTarget(booking);
        setDeleteModalOpen(true);
    };

    useEffect(() => {
        async function loadData() {
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
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen py-20">
                <DotLoader size={80} color="#8b4513" />
            </div>
        );
    }

    const handleRowClick = (booking) => {
        // order now includes recordId
        setSelectedBookings(booking);
    };

    const handleUpdateBooking = async (updatedRow) => {
        setUpdating(true);
        try {
            if (!updatedRow?.recordId) {
                toast.error("RecordId is missing from payload");
                setUpdating(false);
                return;
            }

            const res = await fetch(`/api/book-handyman/${updatedRow.recordId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: updatedRow.status }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update order");
            }

            const updatedBooking = await res.json();

            // Update local state using recordId
            setBookings(prev =>
                prev.map(o => 
                    o.recordId === updatedRow.recordId 
                    ? { ...o, ...updatedBooking.fields } 
                    : o
                )
            );

            toast.success("Booking status updated successfully!");
            setSelectedBookings(null); // modal closing is handled by AdminDataTable/StatusUpdate

        } catch (err) {
            console.error("Error updating booking:", err);
            toast.error(`Update failed: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (booking) => {
        if (!bookings?.recordId) return toast.error("No record ID found for deletion");

        setUpdating(true); // optional: disables buttons while deleting
        try {
            const res = await fetch(`/api/book-handyman/${bookings.recordId}`, { method: "DELETE" });

            if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to delete booking");
            }

            // Remove from local state so both table and metrics update instantly
            setBookings(prev => prev.filter(o => o.recordId !== book.recordId));

            toast.success("Booking deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error(`Delete failed: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };


    const fieldOptions = {
        status: [
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
        ],
    };

    // console.log("Bookings", bookings)
    return (
        <>
            <AdminHeader title="Booking Management" />
            <BookingMetricSection bookings={bookings} />

            <AdminDataTable
                data={bookings}
                columns={["id", "handyman_name", "customer_name", "customer_number", "booking_date", "service_type", "status"]}
                onDelete={handleDelete}
                onRowClick={handleRowClick} 
                onEdit={handleUpdateBooking}
                fieldOptions={fieldOptions}
            />

            <AdminBookingCalendar bookings={bookings} />
        </>
    );
}
