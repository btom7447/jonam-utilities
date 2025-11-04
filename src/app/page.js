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
import { toast } from "react-toastify";

export default function Home() {
    const router = useRouter();

   useEffect(() => {
     getRedirectResult(auth)
       .then((result) => {
         if (result && result.user) {
           const user = result.user;

           toast.success(`Welcome, ${user.displayName || user.email}!`);

           // Redirect based on email domain
           const email = user.email?.toLowerCase() || "";
           if (email.endsWith("@jonam.ng")) {
             router.push("/admin"); // Jonam staff
           } else {
             router.push("/"); // Regular user
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
