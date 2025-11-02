"use client"

import BrandsSection from "@/components/BrandsSection";
import CategorySection from "@/components/CategorySection";
import ContactSection from "@/components/ContactSection";
import FooterSocials from "@/components/FooterSocials";
import HeroSection from "@/components/HeroSection";
import NewProductsSection from "@/components/FeaturedProductSection";
import QuotePoster from "@/components/QuotePoster";
import ServicesPoster from "@/components/ServicesPoster";
import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
      getRedirectResult(auth)
        .then((result) => {
          if (result && result.user) {
            const user = result.user;

            toast.success(`Welcome, ${user.displayName || user.email}!`);

            // Redirect based on admin or regular user
            const ADMIN_EMAILS = [
              "jonamengr@gmail.com",
              "joshuaobasi236@gmail.com",
              "tomekemini7447@gmail.com",
              "tombenjamin7447@gmail.com",
            ];

            if (ADMIN_EMAILS.includes(user.email)) {
              router.push("/admin");
            } else {
              router.push("/");
            }
          }
        })
        .catch((error) => {
          console.error("Redirect login error:", error);
          toast.error(error.message || "Google login failed");
        });
    }, [router]);

  return (
    <div className="">
      <HeroSection />
      <CategorySection />
      <NewProductsSection />
      <ServicesPoster />
      <QuotePoster />
      <BrandsSection />
      <ContactSection />
      <FooterSocials />
    </div>
  );
}
