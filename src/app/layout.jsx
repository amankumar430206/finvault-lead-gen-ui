import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import TopLoader from "./components/ui/TopLoader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Myntpe - Send Money Easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TopLoader />
        <Toaster toastOptions={{ removeDelay: 1000 }} />
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
