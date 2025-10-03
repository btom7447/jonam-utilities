"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AdminSidebar from "@/components/AdminSidebar";
import { MoonLoader } from "react-spinners";
import {
  Package,
  HouseIcon,
  ZapIcon,
  HardHatIcon,
  CalendarIcon,
  MenuIcon,
  XIcon,
  ShoppingCartIcon,
  FoldersIcon,
} from "lucide-react";
import Footer from "@/components/Footer";

const ADMIN_EMAILS = [
  "jonamengr@gmail.com",
  "joshuaobasi236@gmail.com",
  "tomekemini7447@gmail.com",
  "tombenjamin7447@gmail.com",
];

export default function AdminLayout({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: HouseIcon, title: "Dashboard Overview" },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarIcon, title: "Bookings Management" },
    { href: "/admin/handymen", label: "Handymen", icon: HardHatIcon,  title: "Handyman Management" },
    { href: "/admin/orders", label: "Orders", icon: Package,  title: "Order Management"  },
    { href: "/admin/products", label: "Products", icon: ShoppingCartIcon,  title: "Product Management"  },
    { href: "/admin/projects", label: "Projects", icon: FoldersIcon,  title: "Product Management"  },
    { href: "/admin/services", label: "Services", icon: ZapIcon,  title: "Services Management" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !ADMIN_EMAILS.includes(user.email)) {
        router.replace("/");
        return;
      }
      setAuthorized(true);
      setLoading(false);
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

  if (!authorized) return null;

  return (
    <div className="fixed top-0 left-0 z-[2000] flex h-[100dvh] w-[100dvw] bg-blue-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 transform transition-transform duration-300 z-[2500]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <AdminSidebar navItems={navItems} />
      </div>

      {/* Main content */}
      <div className="flex-1 h-[100dvh] overflow-y-scroll flex flex-col">
        {/* Header with hamburger (mobile only) */}
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
  );
}
