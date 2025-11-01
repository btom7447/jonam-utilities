"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { logout } from "src/lib/firebase";
import {
  LogOutIcon,
  ListIcon,
  ChevronDown,
  TagIcon,
  BoxIcon,
  LayersIcon,
  MailIcon,
  FileTextIcon,
  InboxIcon,
  MessageCircleIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";

export default function AdminSidebar({ navItems, isSuperAdmin }) {
  const pathname = usePathname();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [communicationsOpen, setCommunicationsOpen] = useState(false);
  const inventoryRef = useRef(null);
  const communicationsRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You're logged out!");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Filter out “Staffs” for non-super-admins
  const filteredNavItems = navItems.filter(
    (item) => isSuperAdmin || item.label !== "Staffs"
  );

  // Automatically open accordions if on nested path
  useEffect(() => {
    if (
      ["/admin/categories", "/admin/brands", "/admin/products"].includes(
        pathname
      )
    ) {
      setInventoryOpen(true);
    }
    if (
      ["/admin/quotes", "/admin/newsletter", "/admin/contacts"].includes(
        pathname
      )
    ) {
      setCommunicationsOpen(true);
    }
  }, [pathname]);

  return (
    <aside className="adminSidebar w-full h-full bg-gray-900 border-r border-blue-500 px-10 py-5 flex flex-col justify-between items-center pb-20 overflow-y-auto">
      <div className="flex flex-col items-center">
        <Link
          href="/"
          className="flex items-center justify-center bg-white p-2 rounded-full"
        >
          <Image
            src={"/favicon.png"}
            alt="Jonam Utilities logo"
            width={30}
            height={30}
            className="w-30 h-auto object-contain"
            unoptimized
          />
        </Link>
        <h1 className="mt-3 text-xl text-white font-semibold text-center">
          Jonam Utilities <br /> Admin
        </h1>
      </div>

      <nav className="w-full mt-10">
        <ul className="space-y-5 w-full">
<<<<<<< HEAD
<<<<<<< HEAD
          +{" "}
=======
>>>>>>> 32ddb45 (role display on admin)
=======
=======
          +{" "}
>>>>>>> 84cb04f05b3943f29ffe92f9b8f419a730b55602
>>>>>>> 3224781 (Resolve merge conflicts for admin and API routes)
          {filteredNavItems.map(({ href, label, icon: Icon }) => {
            // INVENTORY ACCORDION
            if (label === "Products") {
              const active = ["/categories", "/brands", "/products"].includes(
                pathname
              );

              return (
                <li key="inventory" className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setInventoryOpen(!inventoryOpen)}
                    className={`w-full flex items-center justify-between py-2 text-lg transition-colors duration-300 cursor-pointer ${
                      active
                        ? "text-blue-500 font-semibold"
                        : "text-gray-200 hover:text-blue-500"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <ListIcon size={18} />
                      Inventory
                    </span>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform duration-300 ${
                        inventoryOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Smooth accordion */}
                  <div
                    ref={inventoryRef}
                    style={{
                      maxHeight: inventoryOpen
                        ? `${inventoryRef.current?.scrollHeight}px`
                        : "0px",
                    }}
                    className="overflow-hidden transition-max-height duration-300"
                  >
                    <ul className="pl-3 mt-2 space-y-5">
                      <li>
                        <Link
                          href="/admin/categories"
                          className={`w-fit flex items-center gap-2 py-1 relative ${
                            pathname === "/admin/categories"
                              ? "text-blue-500 font-semibold"
                              : "text-gray-200 hover:text-blue-500"
                          }`}
                        >
                          <TagIcon size={16} />
                          Categories
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/brands"
                          className={`w-fit flex items-center gap-2 py-1 relative ${
                            pathname === "/admin/brands"
                              ? "text-blue-500 font-semibold"
                              : "text-gray-200 hover:text-blue-500"
                          }`}
                        >
                          <LayersIcon size={16} />
                          Brands
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/products"
                          className={`w-fit flex items-center gap-2 py-1 relative ${
                            pathname === "/admin/products"
                              ? "text-blue-500 font-semibold"
                              : "text-gray-200 hover:text-blue-500"
                          }`}
                        >
                          <BoxIcon size={16} />
                          Products
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              );
            }

            // COMMUNICATIONS ACCORDION
            if (label === "Communications") {
              const active = ["/requests", "/newsletter", "/contacts"].includes(
                pathname
              );

              return (
                <li key="communications" className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setCommunicationsOpen(!communicationsOpen)}
                    className={`w-full flex items-center justify-between py-2 text-lg transition-colors duration-300 cursor-pointer ${
                      active
                        ? "text-blue-500 font-semibold"
                        : "text-gray-200 hover:text-blue-500"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <MailIcon size={18} />
                      Info
                    </span>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform duration-300 ${
                        communicationsOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Smooth accordion */}
                  <div
                    ref={communicationsRef}
                    style={{
                      maxHeight: communicationsOpen
                        ? `${communicationsRef.current?.scrollHeight}px`
                        : "0px",
                    }}
                    className="overflow-hidden transition-max-height duration-300"
                  >
                    <ul className="pl-3 mt-2 space-y-5">
                      <li>
                        <Link
                          href="/admin/quotes"
                          className={`w-fit flex items-center gap-2 py-1 relative ${
                            pathname === "/admin/quotes"
                              ? "text-blue-500 font-semibold"
                              : "text-gray-200 hover:text-blue-500"
                          }`}
                        >
                          <FileTextIcon size={16} />
                          Request Quote
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/newsletter"
                          className={`w-fit flex items-center gap-2 py-1 relative ${
                            pathname === "/admin/newsletter"
                              ? "text-blue-500 font-semibold"
                              : "text-gray-200 hover:text-blue-500"
                          }`}
                        >
                          <InboxIcon size={16} />
                          Newsletter
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/contacts"
                          className={`w-fit flex items-center gap-2 py-1 relative ${
                            pathname === "/admin/contacts"
                              ? "text-blue-500 font-semibold"
                              : "text-gray-200 hover:text-blue-500"
                          }`}
                        >
                          <MessageCircleIcon size={16} />
                          Contact Form
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              );
            }

            // DEFAULT LINKS
            const active = pathname === href;
            return (
              <li key={href} className="relative w-full">
                <Link
                  href={href}
                  className={`w-fit relative flex items-center py-2 text-lg transition-colors duration-300 ${
                    active
                      ? "text-blue-500 font-semibold"
                      : "text-gray-200 hover:text-blue-500"
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {label}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 transition-all duration-200 ${
                      active
                        ? "w-full bg-blue-500"
                        : "w-0 group-hover:w-full group-hover:bg-blue-500"
                    }`}
                  ></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="text-2xl flex gap-2 items-center text-white cursor-pointer hover:text-blue-500 mt-10"
      >
        <LogOutIcon size={20} />
        Logout
      </button>
    </aside>
  );
}
