"use client";

import AdminDataTable from "@/components/AdminDataTable";
import AdminHeader from "@/components/AdminHeader";
import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";

export default function AdminOrdersPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (!Array.isArray(data)) {
                console.error("Products not array:", data);
                setProducts([]);
                } else {
                setProducts(data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
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

    const handleEdit = (order) => {
        console.log("Edit order:", order);
        // navigate or open modal
    };

    const handleDelete = (order) => {
        console.log("Delete order:", order);
        // call delete API
    };

    return (
        <>
            <AdminHeader title={"Products Management"} />
            <AdminDataTable
                data={products}
                columns={["ID", "Name", "Price", "Payment_Option", "Order_Date", "Status"]}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    )
}