"use client";

import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const LOAN_TYPES = [
  { id: "education", label: "Education Loan", icon: "🎓", desc: "Fund your studies abroad", rate: "8.5%", max: "₹75L" },
  { id: "personal", label: "Personal Loan", icon: "👤", desc: "For any personal expenses", rate: "10.9%", max: "₹25L" },
  { id: "home", label: "Home Loan", icon: "🏠", desc: "Purchase or construct a home", rate: "8.9%", max: "₹5Cr" },
  { id: "business", label: "Business Loan", icon: "💼", desc: "Grow your business", rate: "12.5%", max: "₹2Cr" },
  { id: "vehicle", label: "Vehicle Loan", icon: "🚗", desc: "Buy your dream vehicle", rate: "9.2%", max: "₹50L" },
  { id: "medical", label: "Medical Loan", icon: "🏥", desc: "Cover medical expenses", rate: "11.5%", max: "₹20L" },
];

const EMPLOYMENT_TYPES = ["Salaried", "Self-Employed", "Business Owner", "Freelancer", "Student", "Retired"];
const TENURES = [12, 24, 36, 48, 60, 84, 120, 180, 240];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
const QUALIFICATIONS = ["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"];
const RESIDENCES = ["Owned", "Rented", "Family-owned", "Company-provided"];

const STEPS = [
  { id: 1, label: "Loan Type", icon: "◈" },
  { id: 2, label: "Personal", icon: "◉" },
  { id: 3, label: "Employment", icon: "◈" },
  { id: 4, label: "Financials", icon: "◉" },
  { id: 5, label: "Documents", icon: "◈" },
  { id: 6, label: "Review", icon: "◉" },
];

// ─────────────────────────────────────────────────────────────
// EMI CALCULATOR
// ─────────────────────────────────────────────────────────────
const calcEMI = (principal, annualRate, months) => {
  if (!principal || !months) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

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
    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="5" cy="5" r="4" />
        <path strokeLinecap="round" d="M5 3v2.5M5 7h.01" />
      </svg>
      {msg}
    </p>
  ) : null;

const inp = (err) =>
  `w-full bg-inputbg border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-[var(--text-muted)] outline-none transition-all duration-200
  ${err ? "border-red-500/45 focus:border-red-500/60" : " border-[var(--border-clr)] focus: border-[var(--border-clr)] focus:bg-accent/[0.03]"}`;

const Field = ({ label, required, error, children, className = "" }) => (
  <div className={className}>
    {label && <Label required={required}>{label}</Label>}
    {children}
    <Err msg={error?.message} />
  </div>
);

// Custom select dropdown
const Select = ({ value, onChange, onBlur, options, placeholder, error }) => {
  const [open, setOpen] = useState(false);
  const sel = options.find((o) => (o.value ?? o) === value);
  const display = sel ? (sel.label ?? sel) : null;
  return (
    <div className="relative">
      <button
        type="button"
        onBlur={() => {
          onBlur?.();
          setTimeout(() => setOpen(false), 150);
        }}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all
          ${error ? "border-red-500/45" : open ? "border-emerald-500/45 bg-accent/[0.03]" : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)]"}
          ${display ? "text-primary" : "text-primary/70"}`}
      >
        {display ?? placeholder}
        <svg
          viewBox="0 0 10 6"
          className={`w-3 h-1.5 text-primary/70 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" d="M1 1l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border  border-[var(--border-clr)] bg-card2 shadow-md overflow-hidden max-h-52 overflow-y-auto">
          {options.map((opt) => {
            const v = opt.value ?? opt;
            const l = opt.label ?? opt;
            return (
              <button
                key={v}
                type="button"
                onMouseDown={() => {
                  onChange(v);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex justify-between
                  ${v === value ? "text-accent bg-accent/10" : "text-primary/60 hover:text-primary hover:bg-inputbg"}`}
              >
                {l}
                {v === value && <span className="text-accent">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Pill toggle group
const PillGroup = ({ value, onChange, options }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const v = opt.value ?? opt;
      const l = opt.label ?? opt;
      const active = value === v;
      return (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all
            ${active ? "bg-accent/12 border-accent/50 text-accent" : "bg-inputbg  border-[var(--border-clr)] text-primary/45 hover:text-primary/70 hover: border-[var(--border-clr)]"}`}
        >
          {l}
        </button>
      );
    })}
  </div>
);

// Range slider with live fill
const RangeSlider = ({ value, onChange, min, max, step = 1, formatVal }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative py-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer"
        style={{ background: `linear-gradient(to right,#10b981 ${pct}%,rgba(255,255,255,0.07) ${pct}%)` }}
      />
      <style>{`input[type=range]::-webkit-slider-thumb{appearance:none;width:20px;height:20px;border-radius:50%;background:#10b981;cursor:pointer;border:2px solid #0b0d12;box-shadow:0 0 10px rgba(16,185,129,.45);}input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#10b981;cursor:pointer;border:2px solid #0b0d12;}`}</style>
    </div>
  );
};

// File upload zone
const FileZone = ({ label, hint, name, register, required }) => {
  const [file, setFile] = useState(null);
  const ref = useRef(null);
  return (
    <div>
      <Label required={required}>{label}</Label>
      {file ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 bg-accent/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center text-[10px] font-bold mono shrink-0">
            {file.name.split(".").pop().toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-primary/75 text-sm truncate">{file.name}</p>
            <p className="text-primary/50 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-primary/70 hover:text-red-400 transition-colors text-xs"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          className="flex flex-col items-center gap-2 py-5 rounded-xl border-2 border-dashed  border-[var(--border-clr)] hover: border-[var(--border-clr)] hover:bg-inputbg cursor-pointer transition-all group"
        >
          <svg
            viewBox="0 0 20 20"
            className="w-5 h-5 text-primary/20 group-hover:text-primary/40 transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-primary/50 text-xs">{hint}</p>
          <input
            ref={ref}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

// Step indicator
const StepBar = ({ current }) => (
  <div className="flex items-center justify-between mb-8 relative">
    <div className="absolute top-3.5 left-0 right-0 h-px bg-inputbg z-0" />
    {STEPS.map((s, i) => {
      const done = s.id < current;
      const active = s.id === current;
      return (
        <div key={s.id} className="flex flex-col items-center gap-2 z-10">
          <div
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300
            ${done ? "bg-accent border-emerald-500 text-primary" : ""}
            ${active ? "bg-card border-emerald-500 text-accent shadow-[0_0_12px_rgba(16,185,129,.35)]" : ""}
            ${!done && !active ? "bg-card  border-[var(--border-clr)] text-primary/20" : ""}`}
          >
            {done ? (
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                <path
                  d="M1.5 5l2.5 2.5 4.5-4.5"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              s.id
            )}
          </div>
          <span
            className={`text-[10px] font-medium hidden sm:block whitespace-nowrap ${active ? "text-accent" : done ? "text-primary/50" : "text-primary/40"}`}
          >
            {s.label}
          </span>
        </div>
      );
    })}
  </div>
);

// Section heading inside form
const SH = ({ n, title, sub }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="w-7 h-7 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center shrink-0">
      {n}
    </span>
    <div>
      <p className="text-primary font-semibold text-[15px] leading-tight">{title}</p>
      {sub && <p className="text-primary/50 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

// Review section
const RSection = ({ title, children }) => (
  <div className="mb-4 last:mb-0">
    <p className="text-[10px] font-bold text-primary/22 uppercase tracking-widest mb-2">{title}</p>
    <div className="bg-inputbg rounded-xl border  border-[var(--border-clr)] px-4 overflow-hidden divide-y divide-white/[0.04]">
      {children}
    </div>
  </div>
);

const RRow = ({ label, value, mono }) => (
  <div className="flex items-start justify-between py-2.5 gap-4">
    <span className="text-primary/50 text-sm shrink-0">{label}</span>
    <span className={`text-sm font-medium text-right ${mono ? "font-mono" : ""} text-primary/70`}>{value || "—"}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function LoanApplyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      loanType: "",
      loanAmount: 500000,
      tenure: 36,
      // personal
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      maritalStatus: "",
      pan: "",
      aadhaar: "",
      mobile: "",
      email: "",
      residenceType: "",
      address: "",
      city: "",
      pincode: "",
      qualification: "",
      // employment
      employmentType: "",
      companyName: "",
      designation: "",
      workExperience: "",
      // financials
      monthlyIncome: "",
      otherIncome: "",
      existingEMIs: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
    },
  });

  const loanType = watch("loanType");
  const loanAmount = watch("loanAmount");
  const tenure = watch("tenure");
  const loanCfg = LOAN_TYPES.find((l) => l.id === loanType);
  const rate = loanCfg ? parseFloat(loanCfg.rate) : 10;
  const emi = calcEMI(loanAmount, rate, tenure);
  const totalPay = emi * tenure;
  const totalInt = totalPay - loanAmount;

  const stepFields = {
    1: ["loanType"],
    2: [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "pan",
      "mobile",
      "email",
      "residenceType",
      "address",
      "city",
      "pincode",
    ],
    3: ["employmentType", "companyName"],
    4: ["monthlyIncome", "bankName", "accountNumber", "ifsc"],
    5: [],
  };

  const next = async () => {
    const valid = await trigger(stepFields[step] ?? []);
    if (valid) setStep((s) => Math.min(s + 1, 6));
  };

  const onSubmit = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2200);
  };

  const v = getValues();

  // ── SUCCESS ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-md"
          style={{ animation: "fadeUp .35s ease" }}
        >
          <div className="h-px w-full bg-gradient-to-r from-bg-card via-accent/80 from-bg-card" />
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-accent/10 animate-ping opacity-30" />
              <div className="relative w-14 h-14 rounded-full bg-accent/12 border border-emerald-500/25 flex items-center justify-center text-3xl">
                {loanCfg?.icon ?? "✓"}
              </div>
            </div>
            <div>
              <h2 className="text-primary text-xl font-semibold">Application Submitted!</h2>
              <p className="text-primary/38 text-sm mt-1.5 leading-relaxed">
                Your <span className="text-primary/65 font-medium">{loanCfg?.label}</span> application is under review.
                We'll respond within <span className="text-primary/65 font-medium">24–48 hours</span>.
              </p>
            </div>
            <div className="w-full bg-inputbg rounded-xl border  border-[var(--border-clr)] divide-y divide-white/[0.04] text-left">
              {[
                ["Application ID", "LN-FV-2026-" + Math.floor(Math.random() * 90000 + 10000), true],
                ["Loan type", loanCfg?.label],
                ["Amount", fmtINR(loanAmount)],
                ["Tenure", `${tenure} months`],
                ["EMI", fmtINR(Math.round(emi)) + " / mo", true],
                ["Status", null],
              ].map(([k, val, mono], i) =>
                k === "Status" ? (
                  <div key={i} className="flex justify-between px-4 py-3">
                    <span className="text-primary/50 text-sm">{k}</span>
                    <span className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Under review
                    </span>
                  </div>
                ) : (
                  <div key={i} className="flex justify-between px-4 py-3">
                    <span className="text-primary/50 text-sm">{k}</span>
                    <span className={`text-primary/65 text-sm font-medium ${mono ? "font-mono" : ""}`}>{val}</span>
                  </div>
                ),
              )}
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
              }}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent/80 text-white font-semibold text-sm transition-all shadow-md shadow-accent/30"
            >
              Apply for Another Loan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base p-4 md:p-8">
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="mb-6 fu">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border  border-[var(--border-clr)] flex items-center justify-center">
              <svg
                viewBox="0 0 25 25"
                className="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75"
                />
              </svg>
            </div>
            <h1 className="text-primary text-xl font-semibold tracking-tight">Loan Application</h1>
            {loanCfg && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border  border-[var(--border-clr)]">
                {loanCfg.icon} {loanCfg.label}
              </span>
            )}
          </div>
          <p className="text-primary/50 text-sm ml-11">Complete all steps to submit your application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* ── MAIN FORM ── */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] shadow-md overflow-hidden fu"
              style={{ animationDelay: ".05s" }}
            >
              <div className="h-px w-full bg-gradient-to-r from-bg-card via-[var(--accent-glow)] from-bg-card" />
              <div className="px-7 pt-7 pb-6">
                <StepBar current={step} />

                {/* ══ STEP 1: LOAN TYPE ══ */}
                {step === 1 && (
                  <div className="fu">
                    <SH n="1" title="Choose your loan type" sub="Select the loan that best fits your need" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {LOAN_TYPES.map((lt) => {
                        const active = loanType === lt.id;
                        return (
                          <button
                            key={lt.id}
                            type="button"
                            onClick={() => {
                              /* react-hook-form set via Controller */
                            }}
                            className="hidden"
                          />
                        );
                      })}
                      <Controller
                        name="loanType"
                        control={control}
                        rules={{ required: "Select a loan type" }}
                        render={({ field }) => (
                          <>
                            {LOAN_TYPES.map((lt) => {
                              const active = field.value === lt.id;
                              return (
                                <button
                                  key={lt.id}
                                  type="button"
                                  onClick={() => field.onChange(lt.id)}
                                  className={`flex flex-col gap-2.5 p-4 rounded-xl border text-left transition-all duration-200
                                    ${active ? " border-[var(--border-clr)] bg-accent/[0.08]" : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)] hover:bg-inputbg"}`}
                                >
                                  <span className="text-xl">{lt.icon}</span>
                                  <div>
                                    <p
                                      className={`text-xs font-semibold ${active ? "text-primary" : "text-primary/60"}`}
                                    >
                                      {lt.label}
                                    </p>
                                    <p className="text-[10px] text-primary/70 mt-0.5">{lt.desc}</p>
                                  </div>
                                  <div className="flex items-center justify-between mt-auto">
                                    <span
                                      className={`text-[10px] font-bold ${active ? "text-accent" : "text-primary/50"}`}
                                    >
                                      {lt.rate} p.a.
                                    </span>
                                    <span className={`text-[10px] ${active ? "text-accent/70" : "text-primary/20"}`}>
                                      Up to {lt.max}
                                    </span>
                                  </div>
                                  {active && (
                                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                                      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                                        <path
                                          d="M2 5l2.5 2.5 3.5-4.5"
                                          stroke="white"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </>
                        )}
                      />
                    </div>
                    <Err msg={errors.loanType?.message} />

                    {/* Loan amount + tenure sliders */}
                    {loanType && (
                      <div className="mt-6 flex flex-col gap-6 si">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Loan amount</Label>
                            <span className="text-accent font-semibold text-sm mono">{fmtINR(loanAmount)}</span>
                          </div>
                          <Controller
                            name="loanAmount"
                            control={control}
                            render={({ field }) => (
                              <RangeSlider
                                value={field.value}
                                onChange={field.onChange}
                                min={50000}
                                max={5000000}
                                step={25000}
                              />
                            )}
                          />
                          <div className="flex justify-between text-[10px] text-primary/20 mt-1 mono">
                            <span>₹50K</span>
                            <span>₹50L</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Tenure</Label>
                            <span className="text-accent font-semibold text-sm mono">{tenure} months</span>
                          </div>
                          <Controller
                            name="tenure"
                            control={control}
                            render={({ field }) => (
                              <div className="flex flex-wrap gap-2">
                                {TENURES.map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => field.onChange(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                                      ${field.value === t ? "bg-accent/12 border-accent/50 text-accent" : "bg-inputbg  border-[var(--border-clr)] text-primary/40 hover:text-primary/65"}`}
                                  >
                                    {t >= 12 && t % 12 === 0 ? `${t / 12}yr` : `${t}mo`}
                                  </button>
                                ))}
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ══ STEP 2: PERSONAL ══ */}
                {step === 2 && (
                  <div className="fu">
                    <SH n="2" title="Personal information" sub="As per your Aadhaar / PAN card" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="First name" required error={errors.firstName}>
                        <input
                          {...register("firstName", { required: "Required" })}
                          placeholder="Jane"
                          className={inp(errors.firstName)}
                        />
                      </Field>
                      <Field label="Last name" required error={errors.lastName}>
                        <input
                          {...register("lastName", { required: "Required" })}
                          placeholder="Doe"
                          className={inp(errors.lastName)}
                        />
                      </Field>
                      <Field label="Date of birth" required error={errors.dob}>
                        <input type="date" {...register("dob", { required: "Required" })} className={inp(errors.dob)} />
                      </Field>
                      <Field label="Gender" required error={errors.gender}>
                        <Controller
                          name="gender"
                          control={control}
                          rules={{ required: "Required" }}
                          render={({ field }) => (
                            <Select {...field} options={GENDERS} placeholder="Select gender" error={errors.gender} />
                          )}
                        />
                      </Field>
                      <Field label="Marital status">
                        <Controller
                          name="maritalStatus"
                          control={control}
                          render={({ field }) => <Select {...field} options={MARITAL_STATUSES} placeholder="Select" />}
                        />
                      </Field>
                      <Field label="Qualification">
                        <Controller
                          name="qualification"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} options={QUALIFICATIONS} placeholder="Highest qualification" />
                          )}
                        />
                      </Field>
                      <Field label="PAN number" required error={errors.pan}>
                        <input
                          {...register("pan", {
                            required: "Required",
                            pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/i, message: "Invalid PAN" },
                          })}
                          placeholder="ABCDE1234F"
                          className={`${inp(errors.pan)} mono uppercase`}
                        />
                      </Field>
                      <Field label="Aadhaar number" error={errors.aadhaar}>
                        <input
                          {...register("aadhaar", { pattern: { value: /^\d{12}$/, message: "Must be 12 digits" } })}
                          placeholder="XXXX XXXX XXXX"
                          className={`${inp(errors.aadhaar)} mono`}
                        />
                      </Field>
                      <Field label="Mobile" required error={errors.mobile}>
                        <div
                          className={`flex items-stretch rounded-xl border overflow-hidden transition-all ${errors.mobile ? "border-red-500/45" : " border-[var(--border-clr)] focus-within:border-emerald-500/45"}`}
                        >
                          <div className="flex items-center bg-inputbg border-r  border-[var(--border-clr)] px-3 shrink-0">
                            <span className="text-primary/50 text-sm mono">+91</span>
                          </div>
                          <input
                            {...register("mobile", {
                              required: "Required",
                              pattern: { value: /^\d{10}$/, message: "10 digits" },
                            })}
                            placeholder="98765 43210"
                            className="flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm px-3.5 py-3 mono"
                          />
                        </div>
                        <Err msg={errors.mobile?.message} />
                      </Field>
                      <Field label="Email address" required error={errors.email}>
                        <input
                          type="email"
                          {...register("email", { required: "Required" })}
                          placeholder="you@email.com"
                          className={inp(errors.email)}
                        />
                      </Field>
                      <Field label="Residence type" required error={errors.residenceType} className="sm:col-span-2">
                        <Controller
                          name="residenceType"
                          control={control}
                          rules={{ required: "Required" }}
                          render={({ field }) => (
                            <PillGroup value={field.value} onChange={field.onChange} options={RESIDENCES} />
                          )}
                        />
                      </Field>
                      <Field label="Current address" required error={errors.address} className="sm:col-span-2">
                        <input
                          {...register("address", { required: "Required" })}
                          placeholder="House no., Street, Area"
                          className={inp(errors.address)}
                        />
                      </Field>
                      <Field label="City" required error={errors.city}>
                        <input
                          {...register("city", { required: "Required" })}
                          placeholder="Mumbai"
                          className={inp(errors.city)}
                        />
                      </Field>
                      <Field label="PIN code" required error={errors.pincode}>
                        <input
                          {...register("pincode", {
                            required: "Required",
                            pattern: { value: /^\d{6}$/, message: "6 digits" },
                          })}
                          placeholder="400001"
                          className={`${inp(errors.pincode)} mono`}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ══ STEP 3: EMPLOYMENT ══ */}
                {step === 3 && (
                  <div className="fu">
                    <SH n="3" title="Employment details" sub="Your current work situation" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Employment type" required error={errors.employmentType} className="sm:col-span-2">
                        <Controller
                          name="employmentType"
                          control={control}
                          rules={{ required: "Required" }}
                          render={({ field }) => (
                            <PillGroup value={field.value} onChange={field.onChange} options={EMPLOYMENT_TYPES} />
                          )}
                        />
                      </Field>
                      <Field
                        label="Company / Organisation name"
                        required
                        error={errors.companyName}
                        className="sm:col-span-2"
                      >
                        <input
                          {...register("companyName", { required: "Required" })}
                          placeholder="Acme Corp"
                          className={inp(errors.companyName)}
                        />
                      </Field>
                      <Field label="Designation">
                        <input {...register("designation")} placeholder="Software Engineer" className={inp(false)} />
                      </Field>
                      <Field label="Work experience">
                        <input
                          {...register("workExperience")}
                          placeholder="e.g. 4 years 2 months"
                          className={inp(false)}
                        />
                      </Field>
                      <Field label="Official email">
                        <input
                          type="email"
                          {...register("workEmail")}
                          placeholder="you@company.com"
                          className={inp(false)}
                        />
                      </Field>
                      <Field label="Office city">
                        <input {...register("officeCity")} placeholder="Bangalore" className={inp(false)} />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ══ STEP 4: FINANCIALS ══ */}
                {step === 4 && (
                  <div className="fu">
                    <SH n="4" title="Financial information" sub="Income & bank account details" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Monthly income (net)" required error={errors.monthlyIncome}>
                        <div
                          className={`flex items-stretch rounded-xl border overflow-hidden transition-all ${errors.monthlyIncome ? "border-red-500/45" : " border-[var(--border-clr)] focus-within:border-emerald-500/45"}`}
                        >
                          <div className="flex items-center bg-inputbg border-r  border-[var(--border-clr)] px-3 shrink-0">
                            <span className="text-primary/50 text-sm">₹</span>
                          </div>
                          <input
                            {...register("monthlyIncome", { required: "Required" })}
                            placeholder="75,000"
                            className="flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm px-3.5 py-3 mono"
                          />
                        </div>
                        <Err msg={errors.monthlyIncome?.message} />
                      </Field>
                      <Field label="Other monthly income">
                        <div className="flex items-stretch rounded-xl border  border-[var(--border-clr)] focus-within:border-emerald-500/45 overflow-hidden">
                          <div className="flex items-center bg-inputbg border-r  border-[var(--border-clr)] px-3 shrink-0">
                            <span className="text-primary/50 text-sm">₹</span>
                          </div>
                          <input
                            {...register("otherIncome")}
                            placeholder="0"
                            className="flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm px-3.5 py-3 mono"
                          />
                        </div>
                      </Field>
                      <Field label="Existing EMIs / month">
                        <div className="flex items-stretch rounded-xl border  border-[var(--border-clr)] focus-within:border-emerald-500/45 overflow-hidden">
                          <div className="flex items-center bg-inputbg border-r  border-[var(--border-clr)] px-3 shrink-0">
                            <span className="text-primary/50 text-sm">₹</span>
                          </div>
                          <input
                            {...register("existingEMIs")}
                            placeholder="0"
                            className="flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm px-3.5 py-3 mono"
                          />
                        </div>
                      </Field>
                      <Field label="Credit score (approx.)">
                        <input {...register("creditScore")} placeholder="e.g. 750" className={`${inp(false)} mono`} />
                      </Field>
                      <div className="sm:col-span-2 h-px bg-inputbg my-1" />
                      <Field label="Bank name" required error={errors.bankName} className="sm:col-span-2">
                        <input
                          {...register("bankName", { required: "Required" })}
                          placeholder="e.g. HDFC Bank"
                          className={inp(errors.bankName)}
                        />
                      </Field>
                      <Field label="Account number" required error={errors.accountNumber}>
                        <input
                          {...register("accountNumber", { required: "Required" })}
                          placeholder="XXXXXXXXXXXX"
                          className={`${inp(errors.accountNumber)} mono`}
                        />
                      </Field>
                      <Field label="IFSC code" required error={errors.ifsc}>
                        <input
                          {...register("ifsc", {
                            required: "Required",
                            pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/i, message: "Invalid IFSC" },
                          })}
                          placeholder="HDFC0001234"
                          className={`${inp(errors.ifsc)} mono uppercase`}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ══ STEP 5: DOCUMENTS ══ */}
                {step === 5 && (
                  <div className="fu">
                    <SH
                      n="5"
                      title="Upload documents"
                      sub="Clear scans or photos accepted (PDF, JPG, PNG · max 10 MB)"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FileZone name="panDoc" label="PAN Card" hint="Upload PAN card scan" required />
                      <FileZone name="aadhaarDoc" label="Aadhaar Card" hint="Upload front & back" required />
                      <FileZone
                        name="salaryDoc"
                        label="Salary Slips (3 months)"
                        hint="Last 3 months salary slips"
                        required
                      />
                      <FileZone name="bankDoc" label="Bank Statement (6 months)" hint="PDF from net banking" required />
                      {loanType === "education" && (
                        <>
                          <FileZone
                            name="offerLetter"
                            label="Offer / Admission Letter"
                            hint="University acceptance letter"
                            required
                          />
                          <FileZone name="feeReceipt" label="Fee Receipt" hint="Fee demand letter" required />
                        </>
                      )}
                      {loanType === "home" && (
                        <>
                          <FileZone
                            name="propertyDoc"
                            label="Property Documents"
                            hint="Sale agreement / title deed"
                            required
                          />
                          <FileZone name="builderNOC" label="Builder NOC" hint="If applicable" />
                        </>
                      )}
                      <FileZone name="photoDoc" label="Passport-size Photo" hint="Recent clear photograph" />
                      <FileZone name="addressDoc" label="Address Proof" hint="Utility bill / Aadhaar / Passport" />
                    </div>
                  </div>
                )}

                {/* ══ STEP 6: REVIEW ══ */}
                {step === 6 && (
                  <div className="fu">
                    <SH n="6" title="Review & submit" sub="Double-check before submitting" />
                    <div className="flex flex-col gap-3">
                      <RSection title="Loan details">
                        <RRow label="Loan type" value={loanCfg?.label} />
                        <RRow label="Amount" value={fmtINR(v.loanAmount)} mono />
                        <RRow label="Tenure" value={`${v.tenure} months`} />
                        <RRow label="Interest rate" value={loanCfg?.rate + " p.a."} mono />
                      </RSection>
                      <RSection title="Personal">
                        <RRow label="Name" value={`${v.firstName} ${v.lastName}`} />
                        <RRow label="DOB" value={v.dob} />
                        <RRow label="PAN" value={v.pan} mono />
                        <RRow label="Mobile" value={`+91 ${v.mobile}`} mono />
                        <RRow label="Email" value={v.email} />
                        <RRow label="City" value={v.city} />
                      </RSection>
                      <RSection title="Employment">
                        <RRow label="Type" value={v.employmentType} />
                        <RRow label="Company" value={v.companyName} />
                        <RRow label="Role" value={v.designation} />
                      </RSection>
                      <RSection title="Financials">
                        <RRow label="Monthly income" value={v.monthlyIncome ? `₹ ${v.monthlyIncome}` : ""} mono />
                        <RRow label="Existing EMIs" value={v.existingEMIs ? `₹ ${v.existingEMIs}` : "₹ 0"} mono />
                        <RRow label="Bank" value={v.bankName} />
                        <RRow label="IFSC" value={v.ifsc} mono />
                      </RSection>
                    </div>

                    {/* Consent */}
                    <div className="mt-5 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => setAgreed((a) => !a)}
                        className="flex items-start gap-2.5 text-left group"
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                          ${agreed ? "bg-accent border-emerald-500" : "border-white/20 group-hover:border-white/40"}`}
                          style={{ minWidth: "16px" }}
                        >
                          {agreed && (
                            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                              <path
                                d="M1.5 5l2.5 2.5 4.5-4.5"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                      <p
                        className={`text-xs leading-relaxed transition-colors ${agreed ? "text-primary/75" : "text-primary/28"}`}
                      >
                        I declare that the information provided is true. I authorise FinVault to process my application
                        and verify details with relevant authorities.
                      </p>
                    </div>
                  </div>
                )}

                {/* Nav buttons */}
                <div className={`flex gap-3 mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/75 hover:text-primary hover:bg-inputbg text-sm font-medium transition-all"
                    >
                      <svg
                        viewBox="0 0 14 14"
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 7H3M6 4L3 7l3 3" />
                      </svg>
                      Back
                    </button>
                  )}
                  {step < 6 ? (
                    <button
                      type="button"
                      onClick={next}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-all shadow-md shadow-accent/30"
                    >
                      Continue
                      <svg
                        viewBox="0 0 14 14"
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h8M8 4l3 3-3 3" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      disabled={!agreed || loading}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
                        ${agreed && !loading ? "bg-accent hover:bg-accent/80 text-white shadow-md shadow-accent/30" : "bg-inputbg border  border-[var(--border-clr)] text-primary/50 cursor-not-allowed"}`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        <>
                          Submit Application{" "}
                          <svg
                            viewBox="0 0 14 14"
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h8M8 4l3 3-3 3" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── SIDEBAR: EMI CARD ── */}
          <div className="flex flex-col gap-4">
            {/* EMI calculator */}
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-xl fu"
              style={{ animationDelay: ".1s" }}
            >
              <div className="h-px w-full bg-gradient-to-r from-bg-card via-cyan-500/40 from-bg-card" />
              <div className="px-5 pt-5 pb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <svg
                      viewBox="0 0 16 16"
                      className="w-3.5 h-3.5 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 15.75L11.03 11.03m0 0A6.75 6.75 0 101.72 4.72a6.75 6.75 0 009.31 6.31z"
                      />
                    </svg>
                  </div>
                  <p className="text-primary font-semibold text-sm">EMI Calculator</p>
                </div>

                {loanType ? (
                  <>
                    {/* EMI hero */}
                    <div className="bg-cyan-500/[0.06] border border-cyan-500/15 rounded-xl px-4 py-4 mb-4 text-center">
                      <p className="text-primary/50 text-xs mb-1">Monthly EMI</p>
                      <p className="text-primary text-2xl font-bold mono">{fmtINR(Math.round(emi))}</p>
                      <p className="text-primary/70 text-xs mt-0.5">for {tenure} months</p>
                    </div>

                    {[
                      ["Principal", fmtINR(loanAmount), "text-primary/65"],
                      ["Total interest", fmtINR(Math.round(totalInt)), "text-amber-400"],
                      ["Total payable", fmtINR(Math.round(totalPay)), "text-primary font-semibold"],
                      ["Interest rate", `${rate}% p.a.`, "text-cyan-400"],
                    ].map(([label, val, cls]) => (
                      <div
                        key={label}
                        className="flex justify-between py-2 border-b  border-[var(--border-clr)] last:border-0"
                      >
                        <span className="text-primary/50 text-xs">{label}</span>
                        <span className={`text-xs font-medium mono ${cls}`}>{val}</span>
                      </div>
                    ))}

                    {/* Donut-style split bar */}
                    <div className="mt-4">
                      <div className="flex h-2 rounded-full overflow-hidden gap-px">
                        <div
                          className="bg-accent rounded-l-full"
                          style={{ width: `${(loanAmount / totalPay) * 100}%` }}
                        />
                        <div className="bg-amber-500/70 rounded-r-full flex-1" />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-accent flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                          Principal
                        </span>
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70 inline-block" />
                          Interest
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-primary/20 text-sm text-center py-6">Select a loan type to see EMI estimate</p>
                )}
              </div>
            </div>

            {/* Eligibility tips */}
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-xl fu"
              style={{ animationDelay: ".15s" }}
            >
              <div className="h-px w-full bg-gradient-to-r from-bg-card via-violet-500/35 from-bg-card" />
              <div className="px-5 pt-5 pb-5">
                <p className="text-primary font-semibold text-sm mb-3.5">Eligibility tips</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    ["CIBIL score ≥ 700", "Higher score = better rate", "✓"],
                    ["Stable income", "Min. 6 months at current job", "✓"],
                    ["Low debt-to-income", "Existing EMIs < 40% of income", "✓"],
                    ["Valid KYC", "PAN + Aadhaar mandatory", "✓"],
                  ].map(([title, sub, icon]) => (
                    <div key={title} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        {icon}
                      </div>
                      <div>
                        <p className="text-primary/60 text-xs font-medium">{title}</p>
                        <p className="text-primary/70 text-[11px]">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] px-5 py-4 fu"
              style={{ animationDelay: ".2s" }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-primary/40 text-xs font-medium">Application progress</p>
                <p className="text-accent text-xs font-semibold mono">{Math.round(((step - 1) / 5) * 100)}%</p>
              </div>
              <div className="h-1.5 bg-inputbg rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${((step - 1) / 5) * 100}%` }}
                />
              </div>
              <p className="text-primary/20 text-[11px] mt-2">
                Step {step} of 6 — {STEPS[step - 1].label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
