"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import UserOrderDetails from "@/components/UserOrderDetails";

export default function UserOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
            setUser(null);
            setLoading(false);
            toast.info("Please log in to view your orders.");
            return;
        }

        setUser(currentUser);
        setLoading(true);

        try {
            // ✅ Step 1: Fetch all orders
            const res = await fetch("/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");

            const allOrders = await res.json();

            // filter user orders
            const userOrders = allOrders.filter(
              (o) =>
                o.customer_email?.toLowerCase() ===
                currentUser.email?.toLowerCase()
            );

            // no second fetch needed — `order_items_id` is already populated
            const mergedData = userOrders.map((order) => ({
              order_meta: order,
              order_items: order.order_items_id || [],
            }));

            setOrders(mergedData);

            } catch (error) {
                console.error("Error fetching user orders:", error);
                toast.error("Failed to load your orders.");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // ✅ UI states
    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <DotLoader size={80} color="#8b4513" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-xl text-center">
                    Please log in to see your orders.
                </p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <section className="flex flex-col items-center justify-center py-20 h-screen">
                <p className="text-gray-500 text-2xl text-center">
                    You haven’t placed any orders yet.
                </p>
            </section>
        );
    }

    // ✅ Render merged order + items
    return (
      <section className="p-5 lg:p-10 space-y-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-5">My Orders</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {orders.map((entry) => (
            <UserOrderDetails
              key={entry.order_meta.recordId || entry.order_meta.id}
              order={entry.order_meta}
              items={entry.order_items}
            />
          ))}
        </div>
      </section>
    );
}
