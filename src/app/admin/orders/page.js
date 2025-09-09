"use client";

import { useEffect, useState } from "react";
import OrderMetricSection from "@/components/OrderMetricSection";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import AdminDataTable from "@/components/AdminDataTable";
import OrderTableDetails from "@/components/StatusUpdate";
import { toast } from "react-toastify";

export default function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDeleteClick = (order) => {
        setDeleteTarget(order);
        setDeleteModalOpen(true);
    };

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/orders");
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setOrders([]);
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

    const handleRowClick = (order) => {
        // order now includes recordId
        setSelectedOrder(order);
    };

    const handleUpdateOrder = async (updatedRow) => {
        setUpdating(true);
        try {
            if (!updatedRow?.recordId) {
                toast.error("RecordId is missing from payload");
                setUpdating(false);
                return;
            }

            const res = await fetch(`/api/orders/${updatedRow.recordId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: updatedRow.status }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update order");
            }

            const updatedOrder = await res.json();

            // Update local state using recordId
            setOrders(prev =>
                prev.map(o => 
                    o.recordId === updatedRow.recordId 
                    ? { ...o, ...updatedOrder.fields } 
                    : o
                )
            );

            toast.success("Order status updated successfully!");
            setSelectedOrder(null); // modal closing is handled by AdminDataTable/StatusUpdate

        } catch (err) {
            console.error("Error updating order:", err);
            toast.error(`Update failed: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (order) => {
        if (!order?.recordId) return toast.error("No record ID found for deletion");

        setUpdating(true); // optional: disables buttons while deleting
        try {
            const res = await fetch(`/api/orders/${order.recordId}`, { method: "DELETE" });

            if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to delete order");
            }

            // Remove from local state so both table and metrics update instantly
            setOrders(prev => prev.filter(o => o.recordId !== order.recordId));

            toast.success("Order deleted successfully!");
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
        { value: "transit", label: "In Transit" },
        { value: "cancelled", label: "Cancelled" },
    ],
};

    return (
        <>
            <AdminHeader title="Order Management" />
            <OrderMetricSection orders={orders} />

            <AdminDataTable
                data={orders}
                columns={["ID", "Customer_Name", "Customer_Number", "Payment_Option", "Order_Date", "Order_Total", "Status"]}
                onDelete={handleDelete}
                onRowClick={handleRowClick} 
                onEdit={handleUpdateOrder}
                fieldOptions={fieldOptions}
            />
        </>
    );
}
