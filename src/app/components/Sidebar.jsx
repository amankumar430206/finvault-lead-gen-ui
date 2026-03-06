"use client";
import { Icon, ICONS } from "@/app/components/icons";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { LayoutContext } from "../(dashboard)/layout";
import Link from "next/link";
import { useSendMoneyForm } from "@/store/form.store";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";

// ─────────────────────────────────────────────
// SIDEBAR COMPONENT
// ─────────────────────────────────────────────

const ROUTES = {
  overview: "/app/overview",
  "send-money": "/app/send-money",
  transactions: "/app/transactions",
  students: "/app/students",
  agents: "/app/agents",
};

export const Sidebar = () => {
  const user = useAuthStore((s) => s.user);
  const isAgent = user?.role === "AGENT";
  const isAdmin = user?.role === "ADMIN";

  const navItems = [
    ...(isAdmin ? [{ label: "Overview", icon: "home", id: "overview", path: ROUTES.overview }] : []),
    { label: "Send Money", icon: "plus", id: "send-money", path: ROUTES["send-money"] },
    { label: "Transactions", icon: "arrow", id: "transactions", path: ROUTES.transactions },
    ...(isAdmin || isAgent ? [{ label: "Students", icon: "users", id: "students", path: ROUTES.students }] : []),
    ...(isAdmin ? [{ label: "Agents", icon: "users", id: "agents", path: ROUTES.agents }] : []),

    { label: "Loan Apply", icon: "trending", id: "wallet", path: "/app/loan-apply" },
    { label: "Forex Card", icon: "creditCard", id: "cards", path: "/app/card-apply" },
    // { label: "Customers", icon: "users", id: "customers", path: "/app/customers" },
    // { label: "Security", icon: "shield", id: "security", path: "/app/security" },
  ];

  const DEFAULT_ACTIVE_ITEM_ID = navItems[0].id;

  const { remitter, clearForm } = useSendMoneyForm((s) => s);
  const router = useRouter();
  const [active, setActive] = useState(DEFAULT_ACTIVE_ITEM_ID);

  const { sidebarOpen, sidebarCollapsed, toggleCollapsed } = useContext(LayoutContext);

  const onNavigate = (id) => {
    const item = navItems.find((i) => i.id === id);
    if (item) {
      setActive(id);
      router.push(item.path);
    }
  };

  const onLinkClick = (id) => setActive(id);

  const handleLogout = () => {
    setActive(DEFAULT_ACTIVE_ITEM_ID);
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" />}

      <aside
        className={[
          "fixed top-0 left-0 h-full z-30 flex flex-col",
          "bg-[#0f1117] border-r border-white/[0.06]",
          "transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[70px]" : "w-[230px]",
          // Mobile: slide in/out
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <Image src="/icons/logo-white.png" width={25} height={25} alt="Logo" />
          </div>
          {!sidebarCollapsed && <span className="text-white font-semibold tracking-tight text-[15px]">Myntpe</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {!sidebarCollapsed && (
            <div className="px-4 pt-5 pb-3">
              <Link
                className="
              flex items-center justify-center gap-2 w-full py-2.5 px-4
              bg-[#00D4A1] hover:bg-[#00bfa0] text-slate-900 text-sm font-bold
              rounded-xl transition-all duration-200 active:scale-95 cursor-pointer
            "
                href={ROUTES["send-money"]}
              >
                <Icon path={ICONS.plus} className="w-[18px] h-[18px] shrink-0" />
                {!sidebarCollapsed && <span>{"Send Money"}</span>}
              </Link>
            </div>
          )}

          <p
            className={`text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2 px-2 ${
              sidebarCollapsed ? "hidden" : ""
            }`}
          >
            Main
          </p>
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                href={item.path}
                key={item.id}
                onClick={() => onLinkClick?.(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg mb-0.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-white/50 hover:text-white/90 hover:bg-white/[0.05]",
                ].join(" ")}
              >
                <Icon path={ICONS[item.icon]} className="w-[18px] h-[18px] shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {isActive && !sidebarCollapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-2 pb-4 border-t border-white/[0.06] pt-3">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all">
            <Icon path={ICONS.settings} className="w-[18px] h-[18px] shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
            onClick={handleLogout}
          >
            <Icon path={ICONS.logout} className="w-[18px] h-[18px] shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex w-full items-center justify-center mt-2 py-2 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all text-xs gap-1"
          >
            <Icon
              path={sidebarCollapsed ? "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" : "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"}
              className="w-3.5 h-3.5"
            />
            {!sidebarCollapsed && <span>Hide</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
