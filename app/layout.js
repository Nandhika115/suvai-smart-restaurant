import "./globals.css";
import { CartProvider } from "../components/CartContext";

export const metadata = {
  title: "Suvai OS — Smart Restaurant Management",
  description: "Digital menu, live availability, reservations, and a full kitchen-to-counter operations dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
