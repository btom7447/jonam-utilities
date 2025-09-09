"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import { DotLoader } from "react-spinners";
import OrderStatusGraph from "@/components/OrderStatusGraph";
import HandymanGigChart from "@/components/HandymanGigChart";
import BookingCalendar from "@/components/BookingCalendar";
import DashboardMetricsSection from "@/components/DashboardMetricsSection";
import DashboardFeaturedProducts from "@/components/DashboardFeaturedProducts";

export default function AdminPage() {
    const [orders, setOrders] = useState([]);
    const [handyman, setHandyman] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/orders");
                const data = await res.json();
                if (!Array.isArray(data)) {
                console.error("Orders not array:", data);
                setOrders([]);
                } else {
                setOrders(data);
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        async function loadHandyman() {
            const res = await fetch("/api/handyman");
            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("Handyman not array:", data);
                setHandyman([]);
            } else {
                setHandyman(data);
            }
            setLoading(false);
        }

        loadHandyman();
    }, []);

    useEffect(() => {
        async function loadingBooking() {
            const res = await fetch("/api/book-handyman");
            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("booking not array:", data);
                setBookings([]);
            } else {
                setBookings(data);
            }
            setLoading(false);
        }

        loadingBooking();
    }, []);

    useEffect(() => {
        async function loadingProducts() {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("products not array:", data);
                setProducts([]);
            } else {
                setProducts(data);
            }
            setLoading(false);
        }

        loadingProducts();
    }, []);

    if (loading) { 
        return ( 
            <div className="flex justify-center items-center w-full h-screen py-20"> 
                <DotLoader size={80} color="#8b4513" /> 
            </div> 
        );
    };

    const totalProducts = products.length;
    const totalHandymen = handyman.length;
    const completedOrders = orders.filter(o => o.status === "completed").length;
    const pendingBookings = bookings.filter(book => book.status === "pending").length;
    const featuredProducts = products.filter((item) => item.featured === "true").slice(0, 4);
    console.log("featured", featuredProducts)

    return (
        <>
            <AdminHeader title={"Dashboard Overview"} />
            <DashboardMetricsSection
                completedOrders={completedOrders}
                totalProducts={totalProducts}
                totalHandymen={totalHandymen}
                pendingBookings={pendingBookings}
            />
            <div className="px-5 lg:px-10 pb-10 grid grid-cols-1 lg:grid-cols-2 items-stretch justify-stretch gap-5">
                <OrderStatusGraph orders={orders} />
                <HandymanGigChart handyman={handyman} />
                <DashboardFeaturedProducts featuredProducts={featuredProducts} />
                <BookingCalendar bookings={bookings} />
            </div>
        </>
    );
}
