import { DM_Sans } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/cartContext";
import { WishlistProvider } from "@/contexts/wishlistContext";
import { ToastContainer } from "react-toastify";
import 'leaflet/dist/leaflet.css';
import { CheckoutProvider } from "@/contexts/checkoutContext";
import { OrderProvider } from "@/contexts/orderContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans", 
});


export const metadata = {
  title: "Jonam Utilities Website",
  description: "A platform for purchasing plumbing materials, hiring handymen, and accessing various utility services.",
};

export default function RootLayout({ children }) {
  return (
    <OrderProvider>
      <CheckoutProvider>
        <CartProvider>
          <WishlistProvider>
            <html lang="en">
              <head>
                <script src="https://js.paystack.co/v1/inline.js"></script>
              </head>
              <body
                className={`${dmSans.variable} antialiased`}
              >
                <Header />
                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnHover
                  draggable
                />
                <div className="mt-19 lg:mt-20 xl:mt-26">
                  {children}
                </div>
                <Footer />
              </body>
            </html>
          </WishlistProvider>
        </CartProvider>
      </CheckoutProvider>
    </OrderProvider>
  );
}
