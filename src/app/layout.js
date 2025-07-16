import { DM_Sans } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/cartContext";
import { WishlistProvider } from "@/contexts/wishlistContext";
import { ToastContainer } from "react-toastify";

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
    <CartProvider>
      <WishlistProvider>
        <html lang="en">
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
            <div className="mt-26">
              {children}
            </div>
            <Footer />
          </body>
        </html>
      </WishlistProvider>
    </CartProvider>
  );
}
