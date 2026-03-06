"use client";

import { useState } from "react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
`;

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar", rate: "83.25" },
  { code: "EUR", flag: "🇪🇺", name: "Euro", rate: "90.42" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound", rate: "105.18" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar", rate: "53.80" },
  { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar", rate: "61.35" },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham", rate: "22.65" },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar", rate: "61.10" },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen", rate: "0.55" },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.157 7.582A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253"
        />
      </svg>
    ),
    title: "16 Currencies",
    desc: "Load USD, EUR, GBP, AUD and 12 more. Switch instantly at live rates.",
    accent: "emerald",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    title: "Zero Forex Markup",
    desc: "No hidden charges on transactions. Use the interbank rate — always.",
    accent: "cyan",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    title: "Chip & PIN + Contactless",
    desc: "Works at 150M+ merchants worldwide. NFC tap for fast checkout.",
    accent: "violet",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 4.5h3M9 21h.008v.008H9V21zm3 0h.008v.008H12V21zm3 0h.008v.008H15V21z"
        />
      </svg>
    ),
    title: "Instant App Control",
    desc: "Lock / unlock, set limits, view real-time spend — right from the app.",
    accent: "amber",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </svg>
    ),
    title: "Free ATM Withdrawals",
    desc: "3 free international ATM withdrawals per month. No surcharge.",
    accent: "rose",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
        />
      </svg>
    ),
    title: "Travel Rewards",
    desc: "Earn 2× FinPoints on every international swipe. Redeem for cashback.",
    accent: "teal",
  },
];

const STEPS = [
  { n: "01", title: "Apply online", desc: "Fill a 2-minute form. No branch visit needed." },
  { n: "02", title: "KYC verification", desc: "Upload PAN + Aadhaar. Verified in minutes." },
  { n: "03", title: "Load & go", desc: "Fund your card and travel with confidence." },
];

const PLANS = [
  {
    id: "classic",
    name: "Classic",
    price: "₹ 299",
    period: "one-time",
    tag: null,
    features: ["8 currencies", "2 free ATM withdrawals/mo", "Chip & PIN", "Basic app controls"],
    accent: "white",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹ 599",
    period: "one-time",
    tag: "Most Popular",
    features: [
      "16 currencies",
      "3 free ATM withdrawals/mo",
      "Contactless NFC",
      "Zero forex markup",
      "Travel rewards 2×",
      "Priority support",
    ],
    accent: "emerald",
  },
  {
    id: "elite",
    name: "Elite",
    price: "₹ 999",
    period: "one-time",
    tag: "Best Value",
    features: [
      "16 currencies + crypto wallet",
      "5 free ATM withdrawals/mo",
      "Metal card",
      "Zero forex markup",
      "Travel rewards 3×",
      "Airport lounge access",
      "Dedicated RM",
    ],
    accent: "amber",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Student, University of Melbourne",
    text: "Used it for 8 months in Australia. Zero fees, instant top-up from the app. Honestly the best travel card I've had.",
    rating: 5,
  },
  {
    name: "Arjun M.",
    role: "Software Engineer, London",
    text: "The zero markup on GBP saved me thousands. Lock/unlock from the phone is a lifesaver.",
    rating: 5,
  },
  {
    name: "Neha T.",
    role: "Frequent traveller",
    text: "Loaded USD, EUR, SGD before a trip. Switching currencies mid-trip was seamless. No nasty surprises.",
    rating: 5,
  },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const accentCls = {
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  cyan: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
  violet: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
  },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-amber-500/20" },
  rose: { border: "border-rose-500/30", bg: "bg-rose-500/10", text: "text-rose-400", glow: "shadow-rose-500/20" },
  teal: { border: "border-teal-500/30", bg: "bg-teal-500/10", text: "text-teal-400", glow: "shadow-teal-500/20" },
  white: { border: "border-white/[0.12]", bg: "bg-white/[0.05]", text: "text-white/70", glow: "" },
};

// ─────────────────────────────────────────────────────────────
// CARD VISUAL
// ─────────────────────────────────────────────────────────────
const ForexCard = ({ plan = "pro", name = "YOUR NAME", rotate = 0 }) => {
  const isPro = plan === "pro";
  const isElite = plan === "elite";

  return (
    <div
      className="relative w-[320px] h-[200px] rounded-2xl overflow-hidden select-none"
      style={{
        transform: `rotate(${rotate}deg)`,
        boxShadow: isPro
          ? "0 24px 60px rgba(16,185,129,.25)"
          : isElite
            ? "0 24px 60px rgba(245,158,11,.2)"
            : "0 24px 48px rgba(0,0,0,.5)",
      }}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${
          isElite
            ? "bg-gradient-to-br from-[#1a1500] via-[#1f1a00] to-[#0f0d00]"
            : isPro
              ? "bg-gradient-to-br from-[#001a0f] via-[#0a1a10] to-[#001208]"
              : "bg-gradient-to-br from-[#0e0e12] via-[#13131a] to-[#08080e]"
        }`}
      />

      {/* Shimmer overlay */}
      <div
        className={`absolute inset-0 opacity-30 ${
          isElite
            ? "bg-gradient-to-tr from-transparent via-amber-400/20 to-transparent"
            : isPro
              ? "bg-gradient-to-tr from-transparent via-emerald-400/15 to-transparent"
              : "bg-gradient-to-tr from-transparent via-white/10 to-transparent"
        }`}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(255,255,255,.5) 20px,rgba(255,255,255,.5) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(255,255,255,.5) 20px,rgba(255,255,255,.5) 21px)",
        }}
      />

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-5">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-syne text-white/30 text-[9px] tracking-[0.2em] uppercase">FinVault</p>
            <p
              className={`font-syne font-bold text-base mt-0.5 ${isElite ? "text-amber-400" : isPro ? "text-emerald-400" : "text-white/80"}`}
            >
              {isElite ? "ELITE" : isPro ? "PRO" : "CLASSIC"}
            </p>
          </div>
          {/* Chip */}
          <div
            className={`w-10 h-7 rounded-md border ${isElite ? "bg-amber-500/20 border-amber-500/30" : isPro ? "bg-emerald-500/20 border-emerald-500/30" : "bg-white/10 border-white/20"} flex items-center justify-center`}
          >
            <div className="w-6 h-5 rounded-sm border border-white/20 grid grid-cols-2 gap-px p-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/20 rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Card number */}
        <div>
          <p className="text-white/30 text-xs mono tracking-[0.25em]">•••• •••• •••• 4821</p>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/25 text-[8px] uppercase tracking-widest">Card holder</p>
            <p className="text-white/70 text-xs font-medium mono mt-0.5">{name}</p>
          </div>
          <div className="text-right">
            <p className="text-white/25 text-[8px] uppercase tracking-widest">Valid thru</p>
            <p className="text-white/70 text-xs mono mt-0.5">03 / 28</p>
          </div>
          {/* Network logo */}
          <div className="flex items-center gap-1 opacity-60">
            <div
              className={`w-6 h-6 rounded-full ${isElite ? "bg-amber-400/70" : isPro ? "bg-emerald-400/70" : "bg-white/40"}`}
            />
            <div
              className={`w-6 h-6 rounded-full -ml-3 ${isElite ? "bg-amber-600/70" : isPro ? "bg-emerald-600/70" : "bg-white/25"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// APPLY MODAL
// ─────────────────────────────────────────────────────────────
const ApplyModal = ({ plan, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", pan: "" });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0f1117] border border-white/[0.08] shadow-2xl overflow-hidden z-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="px-6 pt-6 pb-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-syne text-white font-bold text-lg">Apply for {plan?.name}</h3>
              <p className="text-white/35 text-xs mt-0.5">Takes less than 2 minutes</p>
            </div>
            <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors p-1">
              <svg viewBox="0 0 14 14" className="w-4 h-4" fill="currentColor">
                <path d="M3.293 3.293a1 1 0 011.414 0L7 5.586l2.293-2.293a1 1 0 111.414 1.414L8.414 7l2.293 2.293a1 1 0 01-1.414 1.414L7 8.414l-2.293 2.293a1 1 0 01-1.414-1.414L5.586 7 3.293 4.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 mb-5">
            {["Details", "Verify"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border
                  ${i + 1 < step ? "bg-emerald-500 border-emerald-500 text-white" : i + 1 === step ? "border-emerald-500 text-emerald-400" : "border-white/15 text-white/20"}`}
                >
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${i + 1 === step ? "text-white/60" : "text-white/20"}`}>{s}</span>
                {i < 1 && <div className={`w-6 h-px ${i + 1 < step ? "bg-emerald-500/50" : "bg-white/[0.08]"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-3">
              {[
                { k: "name", p: "Full name", t: "text" },
                { k: "email", p: "Email address", t: "email" },
                { k: "mobile", p: "Mobile number", t: "tel" },
              ].map(({ k, p, t }) => (
                <input
                  key={k}
                  type={t}
                  value={form[k]}
                  onChange={(e) => update(k, e.target.value)}
                  placeholder={p}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-emerald-500/45 transition-all"
                />
              ))}
              <button
                onClick={() => setStep(2)}
                disabled={!form.name || !form.email || !form.mobile}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all mt-1 shadow-lg shadow-emerald-500/20"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3">
              <p className="text-white/35 text-xs">Enter your PAN for KYC verification</p>
              <input
                type="text"
                value={form.pan}
                onChange={(e) => update("pan", e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-emerald-500/45 transition-all font-mono uppercase tracking-widest"
              />
              <div className="flex gap-2.5 rounded-xl bg-blue-500/[0.07] border border-blue-500/20 p-3">
                <svg
                  viewBox="0 0 14 14"
                  className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="7" cy="7" r="5.5" />
                  <path strokeLinecap="round" d="M7 6v4M7 4.5h.01" />
                </svg>
                <p className="text-blue-300/65 text-xs leading-relaxed">
                  Your data is encrypted & processed as per RBI KYC norms. We never share it.
                </p>
              </div>
              <button
                onClick={submit}
                disabled={form.pan.length < 10 || loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Verifying…
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SUCCESS SCREEN
// ─────────────────────────────────────────────────────────────
const SuccessScreen = ({ plan, onReset }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
    <div
      className="relative w-full max-w-sm rounded-2xl bg-[#0f1117] border border-white/[0.08] shadow-2xl overflow-hidden z-10"
      style={{ animation: "modalPop .35s cubic-bezier(.32,.72,0,1)" }}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="p-8 flex flex-col items-center text-center gap-5">
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-30" />
          <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center text-3xl">
            💳
          </div>
        </div>
        <div>
          <h3 className="font-syne text-white text-xl font-bold">You're on the list!</h3>
          <p className="text-white/40 text-sm mt-1.5 leading-relaxed">
            Your <span className="text-white/65 font-medium">FinVault {plan?.name} Forex Card</span> application is
            received. Expect a call within <span className="text-white/65 font-medium">24 hours</span>.
          </p>
        </div>
        <div className="w-full bg-white/[0.03] rounded-xl border border-white/[0.05] divide-y divide-white/[0.04] text-left">
          {[
            ["Card type", plan?.name],
            ["Issuance fee", plan?.price],
            ["Status", null],
          ].map(([k, v], i) =>
            k === "Status" ? (
              <div key={i} className="flex justify-between px-4 py-3">
                <span className="text-white/35 text-sm">{k}</span>
                <span className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Under review
                </span>
              </div>
            ) : (
              <div key={i} className="flex justify-between px-4 py-3">
                <span className="text-white/35 text-sm">{k}</span>
                <span className="text-white/65 text-sm font-medium">{v}</span>
              </div>
            ),
          )}
        </div>
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ForexCardPage() {
  const [activePlan, setActivePlan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-[#080a0e] text-white overflow-x-hidden">
      <style>
        {FONTS}
        {`
        *     { font-family: 'DM Sans', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float    { 0%,100% { transform:translateY(0) rotate(-6deg); } 50% { transform:translateY(-12px) rotate(-6deg); } }
        @keyframes float2   { 0%,100% { transform:translateY(0) rotate(4deg); } 50% { transform:translateY(-8px) rotate(4deg); } }
        @keyframes shimmer  { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
        @keyframes modalPop { from { opacity:0; transform:scale(.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .fu   { animation: fadeUp .5s ease both; }
        .fu1  { animation-delay: .05s; }
        .fu2  { animation-delay: .12s; }
        .fu3  { animation-delay: .19s; }
        .fu4  { animation-delay: .26s; }
        .card-float  { animation: float  5s ease-in-out infinite; }
        .card-float2 { animation: float2 6s ease-in-out infinite; }
      `}
      </style>

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.05] backdrop-blur-md sticky top-0 z-30 bg-[#080a0e]/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
            F
          </div>
          <span className="syne text-white font-bold text-base">FinVault</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-white/40 text-sm">
          {["Features", "How it works", "Pricing", "Reviews"].map((l) => (
            <a key={l} href="#" className="hover:text-white/75 transition-colors">
              {l}
            </a>
          ))}
        </div>
        <button
          onClick={() => setActivePlan(PLANS[1])}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
        >
          Get Card
        </button>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 pt-20 pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-emerald-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-500/[0.05] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 mb-6 fu">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold">Limited time — Zero issuance fee for Pro</span>
            </div>

            <h1 className="syne text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-5 fu fu1">
              Your money,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                every currency.
              </span>
            </h1>

            <p className="text-white/45 text-lg leading-relaxed mb-8 max-w-md fu fu2">
              One card. 16 currencies. Zero forex markup. Travel smarter with the FinVault Forex Card — built for
              students, professionals, and explorers.
            </p>

            <div className="flex flex-wrap gap-3 mb-8 fu fu3">
              <button
                onClick={() => setActivePlan(PLANS[1])}
                className="relative overflow-hidden flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/45 group"
              >
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                Apply now — it's free
                <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h8M8 4l3 3-3 3" />
                </svg>
              </button>
              <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.07] text-white/65 hover:text-white text-sm font-medium transition-all">
                Compare plans
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-white/35 text-xs fu fu4">
              {["No annual fee", "RBI regulated", "Delivered in 5 days"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 12 12"
                    className="w-3 h-3 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M2 6l2.5 2.5 5.5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — stacked cards */}
          <div className="flex items-center justify-center relative py-8 lg:py-0">
            <div className="relative w-[320px] h-[260px]">
              {/* Back card */}
              <div className="absolute top-8 left-8 card-float2 opacity-50">
                <ForexCard plan="classic" rotate={-8} />
              </div>
              {/* Elite card */}
              <div className="absolute top-4 right-0 card-float opacity-70" style={{ animationDelay: "1s" }}>
                <ForexCard plan="elite" rotate={5} />
              </div>
              {/* Pro card — front */}
              <div className="relative z-10 card-float">
                <ForexCard plan="pro" name="JANE DOE" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LIVE RATES TICKER ════════════════════════════════ */}
      <div className="border-y border-white/[0.05] bg-white/[0.02] py-3 overflow-hidden">
        <div className="flex gap-8 animate-none" style={{ animation: "none" }}>
          <div className="flex gap-8 shrink-0" style={{ animation: "ticker 20s linear infinite" }}>
            {[...CURRENCIES, ...CURRENCIES].map((c, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <span>{c.flag}</span>
                <span className="text-white/55 text-sm font-medium mono">{c.code}</span>
                <span className="text-emerald-400 text-sm mono">{c.rate}</span>
                <span className="text-white/20 text-xs">₹</span>
                <span className="text-white/10">·</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}.flex.gap-8{animation:ticker 28s linear infinite;}`}</style>
      </div>

      {/* ══ FEATURES ═════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Why FinVault</p>
            <h2 className="syne text-3xl md:text-4xl font-bold">
              Everything you need,
              <br className="hidden sm:block" /> nothing you don't
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const c = accentCls[f.accent];
              return (
                <div
                  key={i}
                  className={`rounded-2xl border ${c.border} bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all group`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl border ${c.border} ${c.bg} ${c.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {f.icon}
                  </div>
                  <p className="text-white font-semibold text-sm mb-1.5">{f.title}</p>
                  <p className="text-white/38 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="syne text-3xl md:text-4xl font-bold">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-9 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-violet-500/30" />
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.10] flex items-center justify-center relative z-10">
                  <span className="syne text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400">
                    {s.n}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
                  <p className="text-white/38 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="syne text-3xl md:text-4xl font-bold">Pick your card</h2>
            <p className="text-white/38 text-base mt-3">One-time issuance fee. No annual charges. No hidden costs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => {
              const isPro = plan.id === "pro";
              const isElite = plan.id === "elite";
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1
                    ${
                      isPro
                        ? "border-emerald-500/35 bg-emerald-500/[0.05] shadow-xl shadow-emerald-500/10"
                        : isElite
                          ? "border-amber-500/30  bg-amber-500/[0.04]  shadow-xl shadow-amber-500/8"
                          : "border-white/[0.08]  bg-white/[0.02]"
                    }`}
                >
                  {/* Top accent */}
                  <div
                    className={`h-px w-full bg-gradient-to-r from-transparent ${isPro ? "via-emerald-500/60" : isElite ? "via-amber-500/50" : "via-white/20"} to-transparent`}
                  />

                  {plan.tag && (
                    <div
                      className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full
                      ${isPro ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-amber-500/15 text-amber-400 border border-amber-500/25"}`}
                    >
                      {plan.tag}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Mini card thumbnail */}
                    <div className="mb-5 scale-[0.6] origin-top-left -mb-4">
                      <ForexCard plan={plan.id} />
                    </div>

                    <p
                      className={`syne text-lg font-bold mt-6 ${isPro ? "text-emerald-400" : isElite ? "text-amber-400" : "text-white/70"}`}
                    >
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-1 mb-4">
                      <span className="text-white text-2xl font-bold mono">{plan.price}</span>
                      <span className="text-white/30 text-xs">{plan.period}</span>
                    </div>

                    <div className="flex flex-col gap-2 mb-6">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <svg
                            viewBox="0 0 12 12"
                            className={`w-3 h-3 shrink-0 ${isPro ? "text-emerald-400" : isElite ? "text-amber-400" : "text-white/30"}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path d="M2 6l2.5 2.5 5.5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-white/55 text-xs">{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setActivePlan(plan)}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all
                        ${
                          isPro
                            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                            : isElite
                              ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                              : "bg-white/[0.07] hover:bg-white/[0.11] text-white/60 border border-white/[0.09]"
                        }`}
                    >
                      Apply for {plan.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="syne text-3xl font-bold">Loved by travellers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} viewBox="0 0 12 12" className="w-3.5 h-3.5 text-amber-400" fill="currentColor">
                      <path d="M6 1l1.5 3.5L11 5l-2.5 2.5.5 3.5L6 9.5 3 11l.5-3.5L1 5l3.5-.5z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-white/70 text-sm font-semibold">{t.name}</p>
                  <p className="text-white/28 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ═══════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-24 border-t border-white/[0.05] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.06] to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/[0.08] rounded-full blur-[100px]" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="syne text-4xl md:text-5xl font-bold mb-4">
            Ready to travel
            <br />
            without limits?
          </h2>
          <p className="text-white/40 text-lg mb-8">Join 2 lakh+ cardholders who spend smarter abroad.</p>
          <button
            onClick={() => setActivePlan(PLANS[1])}
            className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-base transition-all shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 group"
          >
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            Get your FinVault card
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
          <p className="text-white/20 text-xs mt-4">2-minute application · No branch visit · Delivered to your door</p>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.05] px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              F
            </div>
            <span className="syne text-white/50 font-semibold text-sm">FinVault</span>
          </div>
          <p className="text-white/20 text-xs text-center">
            Regulated by RBI. Forex cards issued in partnership with licensed banking partners. © 2026 FinVault
            Technologies.
          </p>
          <div className="flex items-center gap-1.5 text-white/25 text-xs">
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="2" y="5" width="8" height="6" rx="1" />
              <path strokeLinecap="round" d="M4 5V3.5a2 2 0 014 0V5" />
            </svg>
            256-bit encrypted
          </div>
        </div>
      </footer>

      {/* ══ MODAL ════════════════════════════════════════════ */}
      {activePlan && !showSuccess && (
        <ApplyModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          onSuccess={() => {
            setActivePlan(null);
            setShowSuccess(true);
          }}
        />
      )}
      {showSuccess && <SuccessScreen plan={activePlan ?? PLANS[1]} onReset={() => setShowSuccess(false)} />}
    </div>
  );
}
