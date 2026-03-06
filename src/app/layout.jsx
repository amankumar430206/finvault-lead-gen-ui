import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import TopLoader from "./components/ui/TopLoader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/context/ThemeContext";

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
        {/* Runs before React — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const t = localStorage.getItem('fv-theme') || 'dark';
              document.documentElement.classList.add(t);
            })();
          `,
          }}
        />
        <TopLoader />
        <Toaster toastOptions={{ removeDelay: 1000 }} />
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
