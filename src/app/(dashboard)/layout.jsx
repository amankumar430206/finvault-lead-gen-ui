"use client";
import { createContext, useContext, useState } from "react";
import { Icon, ICONS } from "@/app/components/icons";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

// ─────────────────────────────────────────────
// LAYOUT CONTEXT
// ─────────────────────────────────────────────
export const LayoutContext = createContext(null);
const useLayout = () => useContext(LayoutContext);

export const DashboardLayout = ({ children, title, defaultCollapsed = false, defaultSidebarOpen = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed);

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const toggleCollapsed = () => setSidebarCollapsed((v) => !v);

  return (
    <LayoutContext.Provider value={{ sidebarOpen, sidebarCollapsed, toggleSidebar, toggleCollapsed }}>
      <div className="min-h-screen bg-[#0b0d12] font-sans">
        <Sidebar />
        <Navbar title={title} />
        <main
          className={["transition-all duration-300 pt-16", sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-[230px]"].join(
            " ",
          )}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </LayoutContext.Provider>
  );
};

export default DashboardLayout;
