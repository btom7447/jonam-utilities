"use client";

import { useEffect, useState } from "react";
import { DotLoader, MoonLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import AdminOrderTable from "@/components/AdminOrderTable";
import AdminOrderDetails from "@/components/AdminOrderDetails";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [itemsLoading, setItemsLoading] = useState(false); // 👈 new state

  useEffect(() => {
    async function loadOrders() {
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
    loadOrders();
  }, []);

  const handleRowClick = async (order) => {
    setSelectedOrder(order);
    if (!order?.order_items_id?.length) {
      setOrderItems([]);
      return;
    }

    setItemsLoading(true);
    try {
      // Ensure we send only string IDs
      const ids = order.order_items_id.map((id) =>
        typeof id === "object" ? id._id : id
      );

      const res = await fetch(`/api/order-items?ids=${ids.join(",")}`);
      const data = await res.json();
      setOrderItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch order items:", err);
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
  };


  const handleUpdateOrder = async ({ _id, values }) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update order");
      const updatedOrder = await res.json();

      setOrders((prev) => prev.map((o) => (o._id === _id ? updatedOrder : o)));
      toast.success("Order updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (order) => {
    if (!order?._id) return toast.error("Missing order ID");
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${order._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((o) => o._id !== order._id));
      toast.success("Order deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.message}`);
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
      <AdminHeader title="Orders Management" />

      <AdminOrderTable
        data={orders}
        onEdit={handleUpdateOrder}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
        updating={updating}
      />

      {itemsLoading ? (
        <div className="flex justify-center items-center py-20">
          <MoonLoader size={50} color="#8b4513" />
        </div>
      ) : (
        <AdminOrderDetails items={orderItems} order={selectedOrder} itemsLoading={itemsLoading} />
      )}
    </>
  );
}
