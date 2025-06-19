import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/cartContext";
import { WishlistProvider } from "@/contexts/wishlistContext";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
