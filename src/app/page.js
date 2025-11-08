
import BrandsSection from "@/components/BrandsSection";
import CategorySection from "@/components/CategorySection";
import ContactSection from "@/components/ContactSection";
import FooterSocials from "@/components/FooterSocials";
import HeroSection from "@/components/HeroSection";
import NewProductsSection from "@/components/FeaturedProductSection";
import QuotePoster from "@/components/QuotePoster";
import ServicesPoster from "@/components/ServicesPoster";

export default function Home() {

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
