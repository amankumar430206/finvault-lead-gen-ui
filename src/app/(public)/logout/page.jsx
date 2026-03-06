"use client";

import { useAuthStore } from "@/store/auth.store";
import { useSendMoneyForm } from "@/store/form.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[#070910]" />
    <div
      className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  </div>
);

export default function LogoutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const clearForm = useSendMoneyForm((state) => state.clearForm);

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = () => {
    logout();
    clearForm();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden">
      <BackgroundGrid />

      <div className="relative w-full max-w-[420px] z-10">
        <div className="fade-up delay-4">
          <div className="flex gap-3 items-center justify-center">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        </div>

        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 blur-2xl rounded-full"
          style={{ background: "rgba(16,185,129,0.15)" }}
        />
      </div>
    </div>
  );
}
