"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AdminSidebar from "@/components/AdminSidebar";
import { MoonLoader } from "react-spinners";
import { loadOrCreateUserProfile } from "@/lib/firestoreUser";
import Footer from "@/components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HouseIcon,
  CalendarIcon,
  HardHatIcon,
  MailIcon,
  ShoppingCartIcon,
  TruckIcon,
  Package,
  FoldersIcon,
  UsersIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: HouseIcon },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarIcon },
    { href: "/admin/handymen", label: "Handymen", icon: HardHatIcon },
    { href: "/admin/quotes", label: "Communications", icon: MailIcon },
    { href: "/admin/products", label: "Products", icon: ShoppingCartIcon },
    { href: "/admin/logistics", label: "Logistics", icon: TruckIcon },
    { href: "/admin/orders", label: "Orders", icon: Package },
    { href: "/admin/projects", label: "Projects", icon: FoldersIcon },
    { href: "/admin/staffs", label: "Staffs", icon: UsersIcon },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.warning(
          "Please sign in with your Jonam account to access admin."
        );
        router.replace("/");
        return;
      }

      const email = user.email?.toLowerCase() || "";
      const isJonamStaff = email.endsWith("@jonam.ng");

      if (!isJonamStaff) {
        toast.error(
          "Access denied. Only Jonam staff can access the admin panel."
        );
        router.replace("/");
        return;
      }

      try {
        const profile = await loadOrCreateUserProfile(user);
        setUserProfile(profile);
        setAuthorized(true);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        toast.error("Could not load your profile data.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="z-[5000] fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-gray-900">
        <MoonLoader size={40} color="#fff" />
      </div>
    );
  }

  if (!authorized || !userProfile) return null;

  const isSuperAdmin = userProfile.role === "super-admin";

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed top-0 left-0 z-[1000] flex h-[100dvh] w-[100dvw] bg-blue-50">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-900 transform transition-transform duration-300 z-[1500]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative`}
        >
          <AdminSidebar
            navItems={navItems}
            userProfile={userProfile}
            isSuperAdmin={isSuperAdmin}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 h-[100dvh] overflow-y-scroll flex flex-col">
          {/* Header (mobile only) */}
          <header className="flex items-center justify-between p-4 bg-gray-900 text-white md:hidden">
            <h2 className="text-xl font-semibold">Admin Panel</h2>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <XIcon size={28} /> : <MenuIcon size={28} />}
            </button>
          </header>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}