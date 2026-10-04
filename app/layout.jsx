import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/Toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Announce from "@/components/Announce";

export const metadata = {
  title: "Tshophut — Tees, Dropped Weekly",
  description:
    "Tshophut: small-batch t-shirts dropped every Friday. Heavyweight cotton, honest prices, made to be lived in.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <ToastProvider>
          <CartProvider>
            <Announce />
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
