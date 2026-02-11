import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Restaurant Admin",
  description: "Premium Restaurant Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Background/Font wrapper for Admin Section */}
      <div
        className={`${playfair.variable} ${inter.variable} font-sans antialiased min-h-screen`}
      >
        <AuthProvider>
          <RestaurantProvider>
            {children}
          </RestaurantProvider>
        </AuthProvider>
      </div>
    </>
  );
}
