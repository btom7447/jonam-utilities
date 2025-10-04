"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import UserBookingDetails from "@/components/UserBookingDetails";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        toast.info("Please log in to view your bookings.");
        return;
      }

      setUser(currentUser);
      setLoading(true);

      try {
        // ✅ Step 1: Fetch all bookings
        const res = await fetch("/api/book-handyman");
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const allBookings = await res.json();

        // ✅ Step 2: Filter bookings by user's email (correct property)
        const userBookings = allBookings.filter(
          (b) =>
            b.customer_email?.toLowerCase() === currentUser.email?.toLowerCase()
        );

        console.log("Current user:", currentUser.email);
        console.log("User bookings:", userBookings);

        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        toast.error("Failed to load your bookings.");
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
          Please log in to see your bookings.
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-20 h-screen">
        <p className="text-gray-500 text-2xl text-center">
          You haven’t made any bookings yet.
        </p>
      </section>
    );
  }

  // ✅ Render user bookings
  return (
    <section className="p-5 lg:p-10 space-y-10">
      <h2 className="text-3xl font-semibold text-gray-900 mb-5">My Bookings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {bookings.map((booking) => (
          <UserBookingDetails
            key={booking.recordId || booking.id}
            booking={booking}
          />
        ))}
      </div>
    </section>
  );
}
