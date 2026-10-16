import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export const metadata: Metadata = {
  title: "Kartly — Calm objects for slow homes",
  description:
    "Solid oak, heavy bouclé and hand-thrown clay. Kartly makes furniture, lighting and textiles for slow homes, dispatched in 48 hours.",
  keywords: ["furniture", "scandinavian design", "slow home", "kartly", "nordic", "ceramics", "oak lighting"],
  openGraph: {
    title: "Kartly — Calm objects for slow homes",
    description: "Furniture, lighting and textiles made to be lived with.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Geist:wght@400..600&family=Geist+Mono:wght@400..500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas text-ink antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
