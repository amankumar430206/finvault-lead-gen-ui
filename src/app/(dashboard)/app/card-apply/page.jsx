"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const CARD_PLANS = [
  {
    id: "explorer",
    name: "Explorer",
    tagline: "Best for first-time travellers",
    icon: "🌍",
    fee: "₹299",
    reload: "Free",
    atm: "₹125/txn",
    currencies: 8,
    perks: [
      "Zero forex markup on 8 currencies",
      "Free airport lounge (2/yr)",
      "Travel insurance up to ₹5L",
      "Contactless payments",
    ],
    color: "emerald",
  },
  {
    id: "voyager",
    name: "Voyager",
    tagline: "For international travellers",
    icon: "✈️",
    fee: "₹999",
    reload: "Free",
    atm: "₹75/txn",
    currencies: 16,
    perks: [
      "Zero forex markup on 16 currencies",
      "Unlimited lounge access",
      "Travel insurance up to ₹25L",
      "Global emergency assistance",
      "Priority support",
    ],
    color: "blue",
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Premium business travellers",
    icon: "💎",
    fee: "₹2,499",
    reload: "Free unlimited",
    atm: "Free (5/mo)",
    currencies: 22,
    perks: [
      "Zero forex markup on 22 currencies",
      "Unlimited premium lounge",
      "Comprehensive travel insurance",
      "Concierge 24/7",
      "No ATM fee (5/mo)",
      "Dedicated RM",
    ],
    color: "amber",
  },
];

const CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "NZD", name: "NZ Dollar", flag: "🇳🇿" },
  { code: "HKD", name: "HK Dollar", flag: "🇭🇰" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
];

const TRAVEL_PURPOSES = ["Leisure / Tourism", "Education", "Business", "Medical", "Family Visit", "Other"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const ID_TYPES = ["Passport", "Aadhaar Card", "PAN Card", "Driving Licence", "Voter ID"];

const STEPS = [
  { id: 1, label: "Card Plan" },
  { id: 2, label: "Currencies" },
  { id: 3, label: "Personal" },
  { id: 4, label: "Travel Info" },
  { id: 5, label: "Documents" },
  { id: 6, label: "Review" },
];

const C = {
  emerald: {
    ring: " border-[var(--border-clr)] bg-accent/[0.06]",
    text: "text-accent",
    badge: "bg-accent/10 text-accent  border-[var(--border-clr)]",
    dot: "bg-accent",
    glow: "via-[var(--accent-glow)]",
    btn: "bg-accent hover:bg-accent/80 shadow-accent/20",
    bar: "bg-accent",
  },
  blue: {
    ring: "border-blue-500/50    bg-blue-500/[0.06]",
    text: "text-blue-400",
    badge: "bg-blue-500/10    text-blue-400    border-blue-500/20",
    dot: "bg-blue-400",
    glow: "via-blue-500/45",
    btn: "bg-blue-500    hover:bg-blue-400    shadow-blue-500/25",
    bar: "bg-blue-500",
  },
  amber: {
    ring: "border-amber-500/50   bg-amber-500/[0.06]",
    text: "text-amber-400",
    badge: "bg-amber-500/10   text-amber-400   border-amber-500/20",
    dot: "bg-amber-400",
    glow: "via-amber-500/40",
    btn: "bg-amber-500   hover:bg-amber-400   shadow-amber-500/25",
    bar: "bg-amber-500",
  },
};

// Card gradient backgrounds
const CARD_BG = {
  explorer: "linear-gradient(135deg, #1e3a2f 0%, #0d1f17 100%)",
  voyager: "linear-gradient(135deg, #1a2a4a 0%, #0d1528 100%)",
  elite: "linear-gradient(135deg, #3d2800 0%, #1a1100 100%)",
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

const ErrMsg = ({ msg }) =>
  msg ? (
    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="5" cy="5" r="4" />
        <path strokeLinecap="round" d="M5 3v2.5M5 7h.01" />
      </svg>
      {msg}
    </p>
  ) : null;

const inputCls = (err) =>
  `w-full bg-inputbg border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-[var(--text-muted)] outline-none transition-all duration-200
  ${err ? "border-red-500/45" : " border-[var(--border-clr)] focus: border-[var(--border-clr)] focus:bg-accent/[0.03]"}`;

const Field = ({ label, required, error, children, className = "" }) => (
  <div className={className}>
    {label && <Label required={required}>{label}</Label>}
    {children}
    {error && <ErrMsg msg={error?.message} />}
  </div>
);

const Dropdown = ({ value, onChange, onBlur, options, placeholder, error }) => {
  const [open, setOpen] = useState(false);
  const sel = options.find((o) => (o.value ?? o) === value);
  return (
    <div className="relative">
      <button
        type="button"
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all
          ${error ? "border-red-500/45" : open ? "border-emerald-500/45 bg-accent/[0.03]" : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)]"}
          ${sel ? "text-primary" : "text-primary/70"}`}
      >
        {sel ? (sel.label ?? sel) : placeholder}
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
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex justify-between items-center
                  ${v === value ? "text-accent bg-accent/10" : "text-primary/60 hover:text-primary hover:bg-inputbg"}`}
              >
                {l}
                {v === value && <span className="text-accent text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StepBar = ({ current }) => (
  <div className="flex items-center justify-between mb-8 relative">
    <div className="absolute top-3.5 left-0 right-0 h-px bg-inputbg z-0" />
    {STEPS.map((s) => {
      const done = s.id < current;
      const active = s.id === current;
      return (
        <div key={s.id} className="flex flex-col items-center gap-2 z-10">
          <div
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300
            ${done ? "bg-accent border-emerald-500 text-primary" : active ? "bg-card border-emerald-500 text-accent shadow-[0_0_12px_rgba(16,185,129,.3)]" : "bg-card  border-[var(--border-clr)] text-primary/20"}`}
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
            className={`text-[10px] font-medium hidden sm:block whitespace-nowrap ${active ? "text-accent" : done ? "text-primary/50" : "text-primary/18"}`}
          >
            {s.label}
          </span>
        </div>
      );
    })}
  </div>
);

const SH = ({ n, title, sub }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="w-7 h-7 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center shrink-0">
      {n}
    </span>
    <div>
      <p className="text-primary font-semibold text-[15px]">{title}</p>
      {sub && <p className="text-primary/50 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

const FileZone = ({ label, hint, required }) => {
  const [file, setFile] = useState(null);
  const ref = useRef(null);
  return (
    <div>
      <Label required={required}>{label}</Label>
      {file ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 bg-accent/[0.05]">
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
            className="text-primary/70 hover:text-red-400 transition-colors"
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
            className="w-5 h-5 text-primary/18 group-hover:text-primary/38 transition-colors"
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
          <p className="text-primary/28 text-xs">{hint}</p>
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

const RRow = ({ label, value, mono }) => (
  <div className="flex items-start justify-between py-2.5 border-b  border-[var(--border-clr)] last:border-0 gap-4">
    <span className="text-primary/50 text-sm shrink-0">{label}</span>
    <span className={`text-sm font-medium text-right ${mono ? "font-mono" : ""} text-primary/70`}>{value || "—"}</span>
  </div>
);
const RSection = ({ title, children }) => (
  <div className="mb-4 last:mb-0">
    <p className="text-[10px] font-bold text-primary/22 uppercase tracking-widest mb-2">{title}</p>
    <div className="bg-inputbg rounded-xl border  border-[var(--border-clr)] px-4 overflow-hidden divide-y divide-white/[0.04]">
      {children}
    </div>
  </div>
);

// Visual card component
const CardPreview = ({ plan, selected }) => {
  const c = C[plan.color];
  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 select-none
      ${selected ? `${c.ring} shadow-xl` : " border-[var(--border-clr)] hover: border-[var(--border-clr)]"}`}
      style={{ background: CARD_BG[plan.id] }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)",
          backgroundSize: "7px 7px",
        }}
      />
      {plan.popular && (
        <div className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-primary backdrop-blur-sm z-10">
          Most popular
        </div>
      )}
      {selected && (
        <div className={`absolute top-3 left-3 w-5 h-5 rounded-full ${c.bar} flex items-center justify-center z-10`}>
          <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none">
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
      <div className="relative p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between mt-5">
          <div>
            <p className="text-primary/45 text-[10px] uppercase tracking-widest font-semibold">FinVault</p>
            <p className="text-primary text-lg font-bold mt-0.5">{plan.name}</p>
            <p className="text-primary/50 text-xs mt-0.5">{plan.tagline}</p>
          </div>
          <span className="text-2xl">{plan.icon}</span>
        </div>
        <div className="flex items-center gap-2 my-0.5">
          <div className="w-7 h-5 rounded bg-gradient-to-br from-yellow-300/60 to-yellow-500/40 border border-yellow-400/20" />
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-primary/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
            />
          </svg>
        </div>
        <p className="text-primary/70 text-[11px] mono tracking-[0.18em]">•••• •••• •••• ••••</p>
        <div className="flex items-center gap-3 pt-2 border-t  border-[var(--border-clr)]">
          {[
            ["Currencies", plan.currencies],
            ["Annual fee", plan.fee],
            ["ATM", plan.atm],
          ].map(([k, v]) => (
            <div key={k} className="flex-1">
              <p className="text-primary/70 text-[8px] uppercase tracking-wider">{k}</p>
              <p className="text-primary font-bold text-[11px] mono">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function ForexCardPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selCurr, setSelCurr] = useState(["USD", "EUR", "GBP"]);

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
      cardPlan: "",
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      pan: "",
      mobile: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      travelPurpose: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      initialLoad: "50000",
      idType: "",
      idNumber: "",
    },
  });

  const cardPlan = watch("cardPlan");
  const plan = CARD_PLANS.find((p) => p.id === cardPlan);
  const c = C[plan?.color ?? "emerald"];
  const maxCurr = cardPlan === "explorer" ? 8 : cardPlan === "voyager" ? 16 : 22;
  const v = getValues();

  const stepFields = {
    1: ["cardPlan"],
    2: [],
    3: ["firstName", "lastName", "dob", "pan", "mobile", "email", "address", "city", "pincode"],
    4: ["travelPurpose", "destination", "departureDate"],
    5: [],
  };

  const next = async () => {
    const valid = await trigger(stepFields[step] ?? []);
    if (valid) setStep((s) => Math.min(s + 1, 6));
  };

  const toggleCurr = (code) => {
    setSelCurr((prev) =>
      prev.includes(code)
        ? prev.length > 1
          ? prev.filter((x) => x !== code)
          : prev
        : prev.length < maxCurr
          ? [...prev, code]
          : prev,
    );
  };

  const onSubmit = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 2200);
  };

  // ── SUCCESS ───────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl bg-card border  border-[var(--border-clr)] shadow-md overflow-hidden"
          style={{ animation: "fadeUp .35s ease" }}
        >
          <div className={`h-px w-full bg-gradient-to-r from-bg-card ${c.glow} from-bg-card`} />
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-accent/10 animate-ping opacity-30" />
              <div className="relative w-14 h-14 rounded-full bg-accent/12 border border-emerald-500/25 flex items-center justify-center text-3xl">
                {plan?.icon ?? "💳"}
              </div>
            </div>
            <div>
              <h2 className="text-primary text-xl font-semibold">Application Submitted!</h2>
              <p className="text-primary/40 text-sm mt-1.5 leading-relaxed">
                Your <span className={`font-semibold ${c.text}`}>{plan?.name} Forex Card</span> is being processed.
                Delivery in <span className="text-primary/60 font-medium">5–7 business days</span>.
              </p>
            </div>
            <div className="w-full bg-inputbg rounded-xl border  border-[var(--border-clr)] divide-y divide-white/[0.04] text-left">
              {[
                ["Application ID", "FXC-FV-" + Math.floor(Math.random() * 90000 + 10000), true],
                ["Card plan", plan?.name + " Forex Card"],
                ["Currencies", selCurr.join(", "), true],
                ["Initial load", "₹ " + parseInt(v.initialLoad || 50000).toLocaleString("en-IN")],
                ["Status", null],
                ["Delivery", "5–7 business days"],
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
                setDone(false);
                setStep(1);
                setAgreed(false);
              }}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent/80 text-white font-semibold text-sm transition-all shadow-md shadow-accent/30"
            >
              Apply for Another Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base p-4 md:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6 fu">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border  border-[var(--border-clr)] flex items-center justify-center">
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
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </div>
            <h1 className="text-primary text-xl font-semibold tracking-tight">Apply for Forex Card</h1>
            {plan && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${c.badge}`}>
                {plan.icon} {plan.name}
              </span>
            )}
          </div>
          <p className="text-primary/50 text-sm ml-11">
            Multi-currency prepaid card for international travel · Powered by Visa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* ── MAIN FORM ── */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] shadow-md overflow-hidden fu"
              style={{ animationDelay: ".05s" }}
            >
              <div className={`h-px w-full bg-gradient-to-r from-bg-card ${c.glow} from-bg-card`} />
              <div className="px-7 pt-7 pb-6">
                <StepBar current={step} />

                {/* ══ STEP 1: CARD PLAN ══ */}
                {step === 1 && (
                  <div className="fu">
                    <SH n="1" title="Choose your card plan" sub="Pick the plan that matches your travel style" />
                    <Controller
                      name="cardPlan"
                      control={control}
                      rules={{ required: "Please select a plan" }}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {CARD_PLANS.map((p) => (
                            <div key={p.id} onClick={() => field.onChange(p.id)}>
                              <CardPreview plan={p} selected={field.value === p.id} />
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    <ErrMsg msg={errors.cardPlan?.message} />

                    {plan && (
                      <div className={`mt-5 rounded-xl border p-4 si ${c.ring} border`}>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${c.text}`}>
                          {plan.name} — What's included
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {plan.perks.map((perk, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div
                                className={`w-4 h-4 rounded-full ${c.bar} flex items-center justify-center shrink-0 mt-0.5`}
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
                              <p className="text-primary/55 text-xs leading-relaxed">{perk}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ══ STEP 2: CURRENCIES ══ */}
                {step === 2 && (
                  <div className="fu">
                    <SH n="2" title="Select currencies" sub={`Load up to ${maxCurr} currencies on your card`} />
                    <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl border  border-[var(--border-clr)] bg-inputbg">
                      <span className="text-primary/40 text-sm">Slots used</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold mono ${c.text}`}>{selCurr.length}</span>
                        <span className="text-primary/70 text-sm">/ {maxCurr}</span>
                        <div className="w-20 h-1.5 bg-inputbg rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.bar} transition-all duration-300`}
                            style={{ width: `${(selCurr.length / maxCurr) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {CURRENCIES.map((cur) => {
                        const sel = selCurr.includes(cur.code);
                        const locked = !sel && selCurr.length >= maxCurr;
                        return (
                          <button
                            key={cur.code}
                            type="button"
                            onClick={() => toggleCurr(cur.code)}
                            disabled={locked}
                            className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-left transition-all duration-150
                              ${sel ? `${c.ring} border` : locked ? " border-[var(--border-clr)] bg-inputbg opacity-30 cursor-not-allowed" : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)] hover:bg-inputbg"}`}
                          >
                            <span className="text-lg leading-none shrink-0">{cur.flag}</span>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-bold mono ${sel ? c.text : "text-primary/65"}`}>{cur.code}</p>
                              <p className="text-[10px] text-primary/70 truncate">{cur.name}</p>
                            </div>
                            {sel && (
                              <div
                                className={`w-3.5 h-3.5 rounded-full ${c.bar} flex items-center justify-center shrink-0`}
                              >
                                <svg viewBox="0 0 10 10" className="w-2 h-2" fill="none">
                                  <path
                                    d="M2 5l2 2 3-3.5"
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
                    </div>
                    {selCurr.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selCurr.map((code) => {
                          const cur = CURRENCIES.find((x) => x.code === code);
                          return (
                            <span
                              key={code}
                              className={`inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-full border text-xs font-medium ${c.badge}`}
                            >
                              {cur?.flag} {code}
                              <button
                                type="button"
                                onClick={() => toggleCurr(code)}
                                className="opacity-60 hover:opacity-100 transition-opacity"
                              >
                                <svg
                                  viewBox="0 0 10 10"
                                  className="w-2.5 h-2.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                >
                                  <path strokeLinecap="round" d="M2 2l6 6M8 2L2 8" />
                                </svg>
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-5 pt-4 border-t  border-[var(--border-clr)]">
                      <Field label="Initial load amount (₹)" required>
                        <div className="flex items-stretch rounded-xl border  border-[var(--border-clr)] focus-within:border-emerald-500/45 overflow-hidden">
                          <div className="flex items-center bg-inputbg border-r  border-[var(--border-clr)] px-3 shrink-0">
                            <span className="text-primary/50 text-sm">₹</span>
                          </div>
                          <input
                            {...register("initialLoad")}
                            placeholder="50,000"
                            className="flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm px-3.5 py-3 mono"
                          />
                        </div>
                        <p className="text-primary/22 text-[11px] mt-1.5">
                          Min ₹10,000 · Max ₹7,00,000 per LRS guidelines
                        </p>
                      </Field>
                    </div>
                  </div>
                )}

                {/* ══ STEP 3: PERSONAL ══ */}
                {step === 3 && (
                  <div className="fu">
                    <SH n="3" title="Personal details" sub="As per your KYC documents" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="First name" required error={errors.firstName}>
                        <input
                          {...register("firstName", { required: "Required" })}
                          placeholder="Jane"
                          className={inputCls(errors.firstName)}
                        />
                      </Field>
                      <Field label="Last name" required error={errors.lastName}>
                        <input
                          {...register("lastName", { required: "Required" })}
                          placeholder="Doe"
                          className={inputCls(errors.lastName)}
                        />
                      </Field>
                      <Field label="Date of birth" required error={errors.dob}>
                        <input
                          type="date"
                          {...register("dob", { required: "Required" })}
                          className={inputCls(errors.dob)}
                        />
                      </Field>
                      <Field label="Gender">
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => <Dropdown {...field} options={GENDERS} placeholder="Select gender" />}
                        />
                      </Field>
                      <Field label="PAN number" required error={errors.pan}>
                        <input
                          {...register("pan", {
                            required: "Required",
                            pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/i, message: "Invalid PAN" },
                          })}
                          placeholder="ABCDE1234F"
                          className={`${inputCls(errors.pan)} mono uppercase`}
                        />
                      </Field>
                      <Field label="Mobile number" required error={errors.mobile}>
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
                        <ErrMsg msg={errors.mobile?.message} />
                      </Field>
                      <Field label="Email address" required error={errors.email} className="sm:col-span-2">
                        <input
                          type="email"
                          {...register("email", { required: "Required" })}
                          placeholder="you@email.com"
                          className={inputCls(errors.email)}
                        />
                      </Field>
                      <Field label="Residential address" required error={errors.address} className="sm:col-span-2">
                        <input
                          {...register("address", { required: "Required" })}
                          placeholder="House no., Street, Area"
                          className={inputCls(errors.address)}
                        />
                      </Field>
                      <Field label="City" required error={errors.city}>
                        <input
                          {...register("city", { required: "Required" })}
                          placeholder="Mumbai"
                          className={inputCls(errors.city)}
                        />
                      </Field>
                      <Field label="PIN code" required error={errors.pincode}>
                        <input
                          {...register("pincode", {
                            required: "Required",
                            pattern: { value: /^\d{6}$/, message: "6 digits" },
                          })}
                          placeholder="400001"
                          className={`${inputCls(errors.pincode)} mono`}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ══ STEP 4: TRAVEL INFO ══ */}
                {step === 4 && (
                  <div className="fu">
                    <SH n="4" title="Travel information" sub="Details about your upcoming trip" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Travel purpose" required error={errors.travelPurpose} className="sm:col-span-2">
                        <Controller
                          name="travelPurpose"
                          control={control}
                          rules={{ required: "Select a purpose" }}
                          render={({ field }) => (
                            <div className="flex flex-wrap gap-2">
                              {TRAVEL_PURPOSES.map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => field.onChange(p)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all
                                    ${field.value === p ? `${c.ring} border ${c.text}` : "bg-inputbg  border-[var(--border-clr)] text-primary/45 hover:text-primary/70 hover: border-[var(--border-clr)]"}`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          )}
                        />
                        <ErrMsg msg={errors.travelPurpose?.message} />
                      </Field>
                      <Field
                        label="Destination country / countries"
                        required
                        error={errors.destination}
                        className="sm:col-span-2"
                      >
                        <input
                          {...register("destination", { required: "Required" })}
                          placeholder="e.g. United States, Germany, Australia"
                          className={inputCls(errors.destination)}
                        />
                      </Field>
                      <Field label="Departure date" required error={errors.departureDate}>
                        <input
                          type="date"
                          {...register("departureDate", { required: "Required" })}
                          className={inputCls(errors.departureDate)}
                        />
                      </Field>
                      <Field label="Return date">
                        <input type="date" {...register("returnDate")} className={inputCls(false)} />
                      </Field>
                      <Field label="Card delivery address" className="sm:col-span-2">
                        <input
                          {...register("deliveryAddress")}
                          placeholder="Leave blank to deliver to registered address"
                          className={inputCls(false)}
                        />
                        <p className="text-primary/22 text-[11px] mt-1.5">
                          Card delivered in 5–7 business days after KYC approval
                        </p>
                      </Field>
                    </div>
                  </div>
                )}

                {/* ══ STEP 5: DOCUMENTS ══ */}
                {step === 5 && (
                  <div className="fu">
                    <SH n="5" title="KYC documents" sub="Required for card issuance — PDF, JPG or PNG · max 10 MB" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FileZone label="PAN Card" hint="Clear scan of PAN card" required />
                      <FileZone label="Passport or Aadhaar" hint="Valid government-issued photo ID" required />
                      <FileZone label="Address Proof" hint="Utility bill or bank statement" required />
                      <FileZone label="Passport-size Photo" hint="Recent white-background photograph" required />
                      <Field label="ID type" required className="sm:col-span-2">
                        <Controller
                          name="idType"
                          control={control}
                          render={({ field }) => (
                            <Dropdown {...field} options={ID_TYPES} placeholder="Select primary ID type" />
                          )}
                        />
                      </Field>
                      <Field label="ID / Passport number" required error={errors.idNumber} className="sm:col-span-2">
                        <input
                          {...register("idNumber", { required: "Required" })}
                          placeholder="Enter document number"
                          className={`${inputCls(errors.idNumber)} mono uppercase`}
                        />
                      </Field>
                    </div>
                    <div className="mt-4 flex gap-3 rounded-xl bg-blue-500/[0.07] border border-blue-500/20 p-3.5">
                      <svg
                        viewBox="0 0 16 16"
                        className="w-4 h-4 text-blue-400 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="8" cy="8" r="6.5" />
                        <path strokeLinecap="round" d="M8 7v4M8 5.5h.01" />
                      </svg>
                      <p className="text-blue-300/65 text-xs leading-relaxed">
                        Documents are encrypted and processed per RBI KYC / FEMA guidelines. Your data is never shared
                        with third parties.
                      </p>
                    </div>
                  </div>
                )}

                {/* ══ STEP 6: REVIEW ══ */}
                {step === 6 && (
                  <div className="fu">
                    <SH n="6" title="Review & confirm" sub="Verify all details before submitting" />
                    <div className="flex flex-col gap-3">
                      <RSection title="Card plan">
                        <RRow label="Plan" value={plan?.name + " Forex Card"} />
                        <RRow label="Annual fee" value={plan?.fee} />
                        <RRow label="Currencies" value={selCurr.join(" · ")} mono />
                        <RRow
                          label="Initial load"
                          value={"₹ " + parseInt(v.initialLoad || 50000).toLocaleString("en-IN")}
                          mono
                        />
                        <RRow label="ATM charges" value={plan?.atm} />
                      </RSection>
                      <RSection title="Personal">
                        <RRow label="Name" value={`${v.firstName} ${v.lastName}`} />
                        <RRow label="DOB" value={v.dob} />
                        <RRow label="PAN" value={v.pan} mono />
                        <RRow label="Mobile" value={`+91 ${v.mobile}`} mono />
                        <RRow label="Email" value={v.email} />
                        <RRow label="City" value={v.city} />
                      </RSection>
                      <RSection title="Travel details">
                        <RRow label="Purpose" value={v.travelPurpose} />
                        <RRow label="Destination" value={v.destination} />
                        <RRow label="Departure" value={v.departureDate} />
                        {v.returnDate && <RRow label="Return" value={v.returnDate} />}
                      </RSection>
                    </div>

                    <div className="mt-4 flex gap-3 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 p-3.5">
                      <svg
                        viewBox="0 0 16 16"
                        className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                      <p className="text-amber-300/65 text-xs leading-relaxed">
                        Forex card loading is subject to LRS limit of USD 2,50,000 per financial year. TCS of 20%
                        applicable on loads above ₹7L.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAgreed((a) => !a)}
                      className="mt-4 flex items-start gap-2.5 text-left group w-full"
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed ? "bg-accent border-emerald-500" : "border-white/20 group-hover:border-white/40"}`}
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
                      <p
                        className={`text-xs leading-relaxed transition-colors ${agreed ? "text-primary/75" : "text-primary/28 group-hover:text-primary/40"}`}
                      >
                        I confirm all information is accurate and authorise FinVault to issue a forex card and debit my
                        registered account for the initial load amount, in compliance with RBI FEMA / LRS regulations.
                      </p>
                    </button>
                  </div>
                )}

                {/* Nav */}
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
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-primary text-sm font-semibold transition-all shadow-md ${c.btn}`}
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
                        ${agreed && !loading ? `text-primary shadow-md ${c.btn}` : "bg-inputbg border  border-[var(--border-clr)] text-primary/50 cursor-not-allowed"}`}
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

          {/* ── SIDEBAR ── */}
          <div className="flex flex-col gap-4">
            {/* Card preview */}
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-xl fu"
              style={{ animationDelay: ".08s" }}
            >
              <div className={`h-px w-full bg-gradient-to-r from-bg-card ${c.glow} from-bg-card`} />
              <div className="px-5 pt-5 pb-5">
                <p className="text-primary font-semibold text-sm mb-4">Card Preview</p>
                {plan ? (
                  <div className="si">
                    <CardPreview plan={plan} selected={false} />
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {[
                        ["Annual fee", plan.fee],
                        ["ATM charges", plan.atm],
                        ["Reload fee", plan.reload],
                        ["Currencies", plan.currencies],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-primary/28 text-xs">{k}</span>
                          <span className={`text-xs font-semibold mono ${c.text}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl border-2 border-dashed  border-[var(--border-clr)] flex items-center justify-center">
                    <p className="text-primary/18 text-xs">Select a plan to preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Currencies loaded */}
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-xl fu"
              style={{ animationDelay: ".12s" }}
            >
              <div className="h-px w-full bg-gradient-to-r from-bg-card via-violet-500/35 from-bg-card" />
              <div className="px-5 pt-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-primary font-semibold text-sm">Loaded Currencies</p>
                  <span className={`text-xs font-bold mono ${c.text}`}>
                    {selCurr.length}/{maxCurr}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selCurr.map((code) => {
                    const cur = CURRENCIES.find((x) => x.code === code);
                    return (
                      <span
                        key={code}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-inputbg border  border-[var(--border-clr)] text-xs"
                      >
                        <span>{cur?.flag}</span>
                        <span className="text-primary/60 font-mono font-medium">{code}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Why FinVault forex card */}
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-xl fu"
              style={{ animationDelay: ".16s" }}
            >
              <div className="h-px w-full bg-gradient-to-r from-bg-card via-cyan-500/35 from-bg-card" />
              <div className="px-5 pt-5 pb-5">
                <p className="text-primary font-semibold text-sm mb-3.5">Why FinVault Forex?</p>
                {[
                  { e: "⚡", t: "Instant app reload", s: "Add funds anytime, anywhere" },
                  { e: "🔒", t: "Rate lock", s: "Lock exchange rates pre-travel" },
                  { e: "🌐", t: "200+ countries", s: "Visa-powered global acceptance" },
                  { e: "📊", t: "Spend analytics", s: "Track expenses by currency" },
                  { e: "🛡️", t: "Zero liability", s: "Instant card freeze via app" },
                ].map((f) => (
                  <div key={f.t} className="flex items-start gap-2.5 mb-3 last:mb-0">
                    <span className="text-base shrink-0 mt-0.5">{f.e}</span>
                    <div>
                      <p className="text-primary/65 text-xs font-medium">{f.t}</p>
                      <p className="text-primary/70 text-[11px]">{f.s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div
              className="rounded-2xl bg-card border  border-[var(--border-clr)] px-5 py-4 fu"
              style={{ animationDelay: ".2s" }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-primary/40 text-xs font-medium">Application progress</p>
                <p className={`text-xs font-semibold mono ${c.text}`}>{Math.round(((step - 1) / 5) * 100)}%</p>
              </div>
              <div className="h-1.5 bg-inputbg rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.bar} transition-all duration-500`}
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
