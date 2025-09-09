"use client";

import AdminDataTable from "@/components/AdminDataTable";
import AdminHeader from "@/components/AdminHeader";
import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/book-handyman");
                const data = await res.json();
                if (!Array.isArray(data)) {
                console.error("Bookings not array:", data);
                setBookings([]);
                } else {
                setBookings(data);
                }
            } catch (err) {
                console.error("Error fetching bookings:", err);
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
    };

    console.log("Bookings", bookings)
    const handleEdit = (order) => {
        console.log("Edit Bookings:", bookings);
        // navigate or open modal
    };

    const handleDelete = (order) => {
        console.log("Delete bookings:", bookings);
        // call delete API
    };

    console.log("Bookings", bookings)
    return (
        <>
            <AdminHeader title={"Bookings Management"} />
            <AdminDataTable
                data={bookings}
                columns={["id", "handyman_name", "customer_name", "customer_email", "customer_number", "booking_date", "status"]}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    )
}