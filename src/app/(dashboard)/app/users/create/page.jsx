"use client";

import { useAuthStore } from "@/store/auth.store";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const ROLE_ICONS = {
  ADMIN: (
    <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  ),

  AGENT: (
    <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  ),

  STUDENT: (
    <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
      />
    </svg>
  ),
};

const ROLE_COLORS = {
  emerald: {
    ring: " border-[var(--border-clr)] bg-accent/[0.07]",
    text: "text-accent",
    badge: "bg-accent/10 text-accent  border-[var(--border-clr)]",
  },
};

// ─────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-primary/38 uppercase tracking-widest mb-1.5">
    {children}
    {required && <span className="text-accent ml-0.5">*</span>}
  </label>
);

const Err = ({ msg }) =>
  msg ? (
    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="5" cy="5" r="4" />
        <path strokeLinecap="round" d="M5 3v2.5M5 7h.01" />
      </svg>
      {msg}
    </p>
  ) : null;

const inp = (err) =>
  `w-full bg-inputbg border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-[var(--text-muted)] outline-none transition-all duration-150
  ${err ? "border-red-500/45 focus:border-red-500/60" : " border-[var(--border-clr)] focus: border-[var(--border-clr)] focus:bg-accent/[0.03]"}`;

const Field = ({ label, required, error, children, className = "" }) => (
  <div className={className}>
    {label && <Label required={required}>{label}</Label>}
    {children}
    {error && <Err msg={error?.message} />}
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN FORM
// ─────────────────────────────────────────────────────────────
export default function AddUserForm() {
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();
  const userRoleOption = searchParams.get("role")?.toUpperCase() || "";

  const isAdmin = user?.role === "ADMIN";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUser, setLastUser] = useState(null);

  // ─────────────────────────────────────────────────────────────
  // ROLE CONFIG
  // ─────────────────────────────────────────────────────────────
  const ROLES = [
    ...(isAdmin
      ? [
          {
            id: "ADMIN",
            label: "Admin",
            icon: ROLE_ICONS.ADMIN,
            desc: "Full platform access · Manage users & settings",
            color: "emerald",
          },
          {
            id: "AGENT",
            label: "Agent",
            icon: ROLE_ICONS.AGENT,
            desc: "Handle transfers · KYC review · Client support",
            color: "emerald",
          },
        ]
      : []),
    {
      id: "STUDENT",
      label: "Student",
      icon: ROLE_ICONS.STUDENT,
      desc: "Overseas transfers · Document upload · Basic access",
      color: "emerald",
    },
  ];

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: userRoleOption,
    },
  });

  const role = watch("role");
  const roleCfg = ROLES.find((r) => r.id === role);
  const rc = roleCfg ? ROLE_COLORS[roleCfg.color] : null;

  const onSubmit = (data) => {
    setLoading(true);
    setLastUser(data);
    setSubmitted(true);
  };

  const handleAddAnother = () => {
    reset();
    setSubmitted(false);
    setLastUser(null);
  };

  // ── SUCCESS ───────────────────────────────────────────────
  if (submitted && lastUser) {
    const rc2 = ROLE_COLORS[ROLES.find((r) => r.id === lastUser.role)?.color ?? "emerald"];
    const fakeId = "$oid: " + Math.random().toString(36).slice(2, 18).padEnd(24, "0");
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-md"
          style={{ animation: "fadeUp .3s ease" }}
        >
          <div
            className={`h-px w-full bg-gradient-to-r from-bg-card ${rc2?.ring.includes("violet") ? "via-violet-500/45" : rc2?.ring.includes("emerald") ? "via-[var(--accent-glow)]" : "via-blue-500/45"} from-bg-card`}
          />
          <div className="p-7 flex flex-col items-center text-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/10 animate-ping opacity-30" />
              <div className="relative w-14 h-14 rounded-2xl bg-accent/10 border  border-[var(--border-clr)] flex items-center justify-center">
                <svg
                  viewBox="0 0 20 20"
                  className="w-7 h-7 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-primary text-lg font-semibold">User Created!</h2>
              <p className="text-primary/38 text-sm mt-1">
                <span className="text-primary/65 font-medium">
                  {lastUser.firstName} {lastUser.lastName}
                </span>{" "}
                has been added as <span className={`font-semibold ${rc2?.text}`}>{lastUser.role}</span>.
              </p>
            </div>

            <div className="flex gap-2.5 w-full">
              <button
                onClick={handleAddAnother}
                className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-all shadow-md shadow-accent/30"
              >
                Add Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-lg fu">
        {/* Page title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border  border-[var(--border-clr)] flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 20 20"
              className="w-4 h-4 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-primary font-semibold text-lg tracking-tight">Add New User</h1>
            <p className="text-primary/50 text-xs mt-0.5">Create an Admin, Agent or Student account</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-md">
          <div
            className={`h-px w-full bg-gradient-to-r from-bg-card ${rc ? (roleCfg?.color === "violet" ? "via-violet-500/45" : roleCfg?.color === "blue" ? "via-blue-500/45" : "via-[var(--accent-glow)]") : "via-emerald-500/30"} from-bg-card transition-all duration-500`}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-7 py-6 flex flex-col gap-5">
              {/* ── ROLE SELECTOR ── */}
              <div>
                <Label required>Role</Label>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Select a role" }}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-2.5">
                      {ROLES.map((r) => {
                        const active = field.value === r.id;
                        const rclr = ROLE_COLORS[r.color];
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => field.onChange(r.id)}
                            className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all duration-200
                              ${active ? `${rclr.ring} border` : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)] hover:bg-inputbg"}`}
                          >
                            <span className={active ? rclr.text : "text-primary/50"}>{r.icon}</span>
                            <div>
                              <p className={`text-xs font-bold ${active ? "text-primary" : "text-primary/75"}`}>
                                {r.label}
                              </p>
                              <p className="text-[9px] text-primary/22 mt-0.5 leading-tight hidden sm:block">
                                {r.desc.split("·")[0].trim()}
                              </p>
                            </div>
                            {active && (
                              <div
                                className={`w-4 h-4 rounded-full ${r.color === "violet" ? "bg-violet-500" : r.color === "blue" ? "bg-blue-500" : "bg-accent"} flex items-center justify-center`}
                              >
                                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                                  <path
                                    d="M2 5l2.5 2.5 3.5-4.5"
                                    stroke="white"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                <Err msg={errors.role?.message} />

                {/* Role description pill */}
                {roleCfg && (
                  <div
                    className={`mt-2.5 px-3 py-2 rounded-lg border text-xs ${rc?.badge} border flex items-center gap-1.5`}
                  >
                    <span>{roleCfg.desc}</span>
                  </div>
                )}
              </div>

              {/* ── DIVIDER ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-inputbg" />
                <span className="text-primary/20 text-[10px] uppercase tracking-widest font-semibold">User info</span>
                <div className="flex-1 h-px bg-inputbg" />
              </div>

              {/* ── NAME ── */}
              <div className="grid grid-cols-1  gap-3">
                <Field label="First name" required error={errors.firstName}>
                  <input
                    {...register("firstName", { required: "Required" })}
                    placeholder="First Name"
                    className={inp(errors.firstName)}
                  />
                </Field>
                <Field label="Last name" required error={errors.lastName}>
                  <input
                    {...register("lastName", { required: "Required" })}
                    placeholder="Last Name"
                    className={inp(errors.lastName)}
                  />
                </Field>
              </div>

              {/* ── EMAIL ── */}
              <Field label="Email address" required error={errors.email}>
                <input
                  type="email"
                  {...register("email", {
                    required: "Required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                  })}
                  placeholder="user@example.com"
                  className={inp(errors.email)}
                />
              </Field>

              {/* ── SUBMIT ── */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-5 py-3 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/45 hover:text-primary/70 text-sm font-medium transition-all"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-primary text-sm font-semibold transition-all shadow-md
                    ${loading ? "bg-accent/60 cursor-not-allowed" : "bg-accent hover:bg-accent/80 shadow-accent/20"}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating user…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v12M2 8h12" />
                      </svg>
                      Create User
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-primary/18 text-xs mt-4 flex items-center justify-center gap-1.5">
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="2" y="5" width="8" height="6" rx="1" />
            <path strokeLinecap="round" d="M4 5V3.5a2 2 0 014 0V5" />
          </svg>
          Password is bcrypt hashed before storage
        </p>
      </div>
    </div>
  );
}
