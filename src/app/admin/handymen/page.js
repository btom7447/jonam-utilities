"use client";

import AdminDataTable from "@/components/AdminDataTable";
import AdminHeader from "@/components/AdminHeader";
import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";

export default function AdminHandymanPage() {
    const [handyman, setHandyman] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/handyman");
                const data = await res.json();
                if (!Array.isArray(data)) {
                console.error("Handymen not array:", data);
                setHandyman([]);
                } else {
                setHandyman(data);
                }
            } catch (err) {
                console.error("Error fetching handymen:", err);
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

    console.log("Handymen", handyman)
    const handleEdit = (order) => {
        console.log("Edit Bookings:", handyman);
        // navigate or open modal
    };

    const handleDelete = (order) => {
        console.log("Delete bookings:", handyman);
        // call delete API
    };

    console.log("Handymen", handyman)
    return (
        <>
            <AdminHeader title={"Handyman Management"} />
            <AdminDataTable
                data={handyman}
                columns={["id", "name", "gigs", "availability"]}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    )
}