"use client";

import { useEffect, useState } from "react";
import OrderMetricSection from "@/components/OrderMetricSection";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import AdminDataTable from "@/components/AdminDataTable";
import { toast } from "react-toastify";
import AdminOrderDetails from "@/components/AdminOrderDetails";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleRowClick = async (order) => {
    setSelectedOrder(order);
    if (!order?.customer_orders?.length) {
      setOrderItems([]);
      return;
    }

    try {
      const res = await fetch(`/api/order-items?ids=${order.customer_orders.join(",")}`);
      const data = await res.json();
      setOrderItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch order items:", err);
      setOrderItems([]);
    }
  };

  const handleUpdateOrder = async ({ recordId, values }) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update order");
      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o.recordId === recordId ? { ...o, ...updatedOrder.fields } : o
        )
      );

      toast.success("Order status updated successfully!");
      setSelectedOrder(null);
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (order) => {
    if (!order?.recordId) return toast.error("No record ID found for deletion");
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${order.recordId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((o) => o.recordId !== order.recordId));
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

  console.log("Orders", orders);
  console.log("Order Items", orderItems)
  return (
    <>
      <AdminHeader title="Order Management" />
      <OrderMetricSection orders={orders} />

      <AdminDataTable
        data={orders}
        columns={[
          "ID",
          "Customer_Name",
          "Customer_Number",
          "Payment_Option",
          "Order_Date",
          "Order_Total",
          "Status",
        ]}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
        onEdit={handleUpdateOrder}
        fieldOptions={fieldOptions}
        dataName="orders"
        orderItems={orderItems}
      />

      <AdminOrderDetails items={orderItems} order={selectedOrder} />
    </>
  );
}
