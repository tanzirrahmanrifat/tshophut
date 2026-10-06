import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/Toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Announce from "@/components/Announce";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: {
    default: "Tshophut — Tees, Dropped Weekly",
    template: "%s — Tshophut",
  },
  description:
    "Tshophut: small-batch t-shirts dropped every Friday. Heavyweight cotton, honest prices, made to be lived in.",
  openGraph: {
    title: "Tshophut — Tees, Dropped Weekly",
    description: "Small-batch t-shirts dropped every Friday. Heavyweight cotton, honest prices.",
    siteName: "Tshophut",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tshophut — Tees, Dropped Weekly",
    description: "Small-batch t-shirts dropped every Friday. Heavyweight cotton, honest prices.",
  },
  themeColor: "#17140F",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Announce />
              <Header />
              {children}
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
