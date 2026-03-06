"use client";

import { Icon, ICONS } from "@/app/components/icons";
import { useContext } from "react";
import { LayoutContext } from "../(dashboard)/layout";
import { useAuthStore } from "@/store/auth.store";
import ThemeToggle from "./ThemeToggle";

export const Navbar = ({ title = "Overview" }) => {
  const { sidebarCollapsed, toggleSidebar } = useContext(LayoutContext);
  const user = useAuthStore((state) => state.user);

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest User";

  return (
    <header
      className={[
        "fixed top-0 right-0 h-16 z-10",
        "bg-base/80 backdrop-blur-md border-b  border-[var(--border-clr)]",
        "flex items-center px-5 gap-4 transition-all duration-300",
        sidebarCollapsed ? "left-[70px]" : "left-[230px]",
        "max-lg:left-0",
      ].join(" ")}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-1.5 rounded-lg text-primary/75 hover:text-primary hover:bg-inputbg transition-all"
      >
        <Icon path={ICONS.menu} className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-primary font-semibold text-[15px] mr-auto">{fullName}</h1>

      {/* Search */}
      {/* <div className="hidden md:flex items-center gap-2 bg-inputbg border  border-[var(--border-clr)] rounded-lg px-3 py-1.5 text-primary/40 text-sm w-52">
        <Icon path={ICONS.search} className="w-4 h-4" />
        <input
          placeholder="Search…"
          className="bg-transparent outline-none text-primary/80 placeholder:text-primary/50 text-sm w-full"
        />
      </div> */}

      {/* Bell */}
      {/* <button className="relative p-2 rounded-lg text-primary/75 hover:text-primary hover:bg-inputbg transition-all">
        <Icon path={ICONS.bell} className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-[#0b0d12]" />
      </button> */}

      <ThemeToggle />

      {/* Avatar */}
      <div className="flex items-center gap-2.5 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {user?.firstName.charAt(0)}
          {user?.lastName.charAt(0)}
        </div>
        <div className="hidden md:block">
          <p className="text-primary text-[13px] font-medium leading-none">{fullName}</p>
          <p className="text-primary/40 text-[11px] mt-0.5">{user?.role || "Student"}</p>
        </div>
        {/* <Icon path={ICONS.chevronDown} className="w-3.5 h-3.5 text-primary/50 hidden md:block" /> */}
      </div>
    </header>
  );
};
