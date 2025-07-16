"use client";

import { useEffect, useState } from "react";
import { getUserSession } from "@/lib/firebase";
import AuthModal from "@/components/AuthModal";

export default function CheckoutLayout({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const session = await getUserSession();
      if (!session?.isLoggedIn) {
        setShowModal(true);
      } else {
        setIsVerified(true);
      }
    }
    checkAuth();
  }, []);

  if (!isVerified && !showModal) return null;

  return (
    <>
      {showModal && <AuthModal onClose={() => setShowModal(false)} back={true} />}
      {isVerified && children}
    </>
  );
}
