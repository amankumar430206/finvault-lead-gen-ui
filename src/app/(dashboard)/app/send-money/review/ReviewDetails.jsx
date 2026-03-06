import { useSendMoneyForm } from "@/store/form.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// STATIC MOCK DATA  (represents values collected across all forms)
// ─────────────────────────────────────────────────────────────
const TRANSFER_DATA = {
  // ── Send Money ────────────────────────────────────────────
  transfer: {
    amount: "1,201.00",
    currency: "USD",
    amountInr: "99,983.25",
    forexRate: "₹ 83.25",
    bankFees: "₹ 1,500.00",
    platformFees: "₹ 1,250.00",
    fcct: "₹ 999.83",
    totalPayable: "₹ 1,03,733.08",
    purposeCode: "Overseas Education – University Fees",
    vendorCode: "UNIV-2024-MEL-001",
    ref: "TXN-FV-20260305-0842",
    initiatedAt: "Mar 05, 2026 · 14:32 IST",
  },

  // ── Recipient ─────────────────────────────────────────────
  recipient: {
    name: "University of Melbourne",
    nickname: "Uni fees",
    category: "Institution",
    categoryIcon: "🎓",
    address1: "Grattan Street",
    address2: "Parkville",
    city: "Melbourne",
    state: "Victoria",
    postalCode: "3010",
    country: "Australia",
    flag: "🇦🇺",
    bankName: "Commonwealth Bank of Australia",
    swift: "CTBAAU2SXXX",
    iban: "—",
    accountNumber: "•••• 8821",
    routingNumber: "—",
    method: "SWIFT / Wire",
  },

  // ── Documents ─────────────────────────────────────────────
  documents: [
    {
      id: "fee-receipt",
      label: "Fee Receipt / Demand Letter",
      file: "fee_receipt_unimelb_2026.pdf",
      size: "245 KB",
      status: "verified",
      required: true,
    },
    {
      id: "offer-letter",
      label: "Offer / Admission Letter",
      file: "offer_letter_unimelb.pdf",
      size: "1.2 MB",
      status: "verified",
      required: true,
    },
    {
      id: "passport",
      label: "Passport Copy",
      file: "passport_jane_doe.pdf",
      size: "820 KB",
      status: "verified",
      required: true,
    },
    {
      id: "loan-letter",
      label: "Education Loan Letter",
      file: "loan_sanction_hdfc.pdf",
      size: "410 KB",
      status: "pending",
      required: false,
    },
    {
      id: "visa",
      label: "Student Visa",
      file: "student_visa_australia.jpg",
      size: "310 KB",
      status: "pending",
      required: false,
    },
  ],

  // ── Sender ────────────────────────────────────────────────
  sender: {
    name: "Jane Doe",
    email: "jane@finvault.io",
    pan: "ABCDE1234F",
    phone: "+91 98765 43210",
    account: "•••• 4821",
    bank: "HDFC Bank",
  },
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const docStatus = {
  verified: {
    label: "Verified",
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  pending: { label: "Under review", bg: "bg-amber-500/10   text-amber-400   border-amber-500/20", dot: "bg-amber-400" },
  rejected: { label: "Rejected", bg: "bg-red-500/10     text-red-400     border-red-500/20", dot: "bg-red-400" },
};

const getFileIcon = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return { label: "PDF", cls: "bg-red-500/12 text-red-400" };
  if (["jpg", "jpeg", "png"].includes(ext)) return { label: "IMG", cls: "bg-blue-500/12 text-blue-400" };
  return { label: "DOC", cls: "bg-white/[0.08] text-white/40" };
};

// ─────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────

const SectionCard = ({ title, subtitle, icon, accent = "emerald", action, children, delay = 0 }) => {
  const accentLine = {
    emerald: "via-emerald-500/45",
    blue: "via-blue-500/45",
    violet: "via-violet-500/45",
    amber: "via-amber-500/45",
    cyan: "via-cyan-500/45",
  }[accent];

  return (
    <div
      className="rounded-2xl bg-[#0f1117] border border-white/[0.07] overflow-hidden shadow-xl"
      style={{ animation: `fadeUp 0.4s ease ${delay}s both` }}
    >
      <div className="px-6 pt-5 pb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                {
                  emerald: "bg-emerald-500/10 text-emerald-400",
                  blue: "bg-blue-500/10 text-blue-400",
                  violet: "bg-violet-500/10 text-violet-400",
                  amber: "bg-amber-500/10 text-amber-400",
                  cyan: "bg-cyan-500/10 text-cyan-400",
                }[accent]
              }`}
            >
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-white font-semibold text-[15px] leading-tight">{title}</h2>
            {subtitle && <p className="text-white/30 text-xs mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="px-6 pb-6 pt-3">{children}</div>
    </div>
  );
};

const Row = ({ label, value, mono = false, valueClass = "", highlight = false }) => (
  <div
    className={`flex items-start justify-between py-2.5 border-b border-white/[0.04] last:border-0 gap-4 ${highlight ? "bg-emerald-500/[0.04] -mx-4 px-4 rounded-lg" : ""}`}
  >
    <span className="text-white/35 text-sm shrink-0">{label}</span>
    <span
      className={`text-sm font-medium text-right leading-snug ${mono ? "font-mono" : ""} ${valueClass || "text-white/72"}`}
    >
      {value}
    </span>
  </div>
);

const EditBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.08] text-xs font-medium transition-all shrink-0"
  >
    <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" />
    </svg>
    Edit
  </button>
);

const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-3">
    <div className="flex-1 h-px bg-white/[0.05]" />
    {label && <span className="text-white/18 text-[10px] uppercase tracking-widest font-semibold">{label}</span>}
    <div className="flex-1 h-px bg-white/[0.05]" />
  </div>
);

// ─────────────────────────────────────────────────────────────
// TRANSFER FLOW TIMELINE
// ─────────────────────────────────────────────────────────────
const Timeline = () => {
  const steps = [
    { label: "Transfer initiated", sub: "Mar 05, 2026 · 14:32 IST", done: true },
    { label: "Documents verified", sub: "2 of 5 pending", done: false, active: true },
    { label: "Compliance check", sub: "Awaiting verification", done: false },
    { label: "Payment processing", sub: "SWIFT / Wire", done: false },
    { label: "Funds delivered", sub: "Est. Mar 07–08, 2026", done: false },
  ];
  return (
    <div className="flex flex-col gap-0">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
              ${s.done ? "bg-emerald-500 border-emerald-500" : s.active ? "bg-emerald-500/10 border-emerald-500" : "bg-white/[0.04] border-white/[0.12]"}`}
            >
              {s.done ? (
                <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : s.active ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-px flex-1 min-h-[24px] my-0.5 ${s.done ? "bg-emerald-500/40" : "bg-white/[0.07]"}`} />
            )}
          </div>
          <div className="pb-5">
            <p
              className={`text-sm font-medium ${s.done ? "text-white" : s.active ? "text-emerald-400" : "text-white/30"}`}
            >
              {s.label}
            </p>
            <p
              className={`text-xs mt-0.5 ${s.done ? "text-white/35" : s.active ? "text-emerald-400/60" : "text-white/20"}`}
            >
              {s.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN REVIEW PAGE
// ─────────────────────────────────────────────────────────────
export default function ReviewPage({ _id = null }) {
  const router = useRouter();
  const { clearForm } = useSendMoneyForm();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { transfer, recipient, documents, sender } = TRANSFER_DATA;

  const handleConfirm = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
    }, 2200);
  };

  // ── Success ───────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl bg-[#0f1117] border border-white/[0.07] overflow-hidden shadow-2xl"
          style={{ animation: "fadeUp 0.35s ease" }}
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="p-8 flex flex-col items-center text-center gap-5">
            {/* Ripple icon */}
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-40" />
              <div className="absolute inset-2 rounded-full bg-emerald-500/10" />
              <div className="relative w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
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
              <h2 className="text-white text-xl font-semibold">Transfer Confirmed!</h2>
              <p className="text-white/40 text-sm mt-1.5 leading-relaxed">
                Your payment of <span className="text-white/65 font-medium">USD 1,201.00</span> to{" "}
                <span className="text-white/65 font-medium">University of Melbourne</span> is being processed.
              </p>
            </div>

            <div className="w-full bg-white/[0.03] rounded-xl border border-white/[0.05] divide-y divide-white/[0.04] text-left">
              {[
                ["Reference", transfer.ref, true],
                ["Amount", `USD ${transfer.amount}`, true],
                ["You pay", transfer.totalPayable, true],
                ["Status", null],
                ["Estimated", "Mar 07–08, 2026"],
              ].map(([k, v, mono], i) =>
                k === "Status" ? (
                  <div key={i} className="flex justify-between px-4 py-3">
                    <span className="text-white/35 text-sm">{k}</span>
                    <span className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Processing
                    </span>
                  </div>
                ) : (
                  <div key={i} className="flex justify-between px-4 py-3">
                    <span className="text-white/35 text-sm">{k}</span>
                    <span className={`text-white/70 text-sm font-medium ${mono ? "font-mono" : ""}`}>{v}</span>
                  </div>
                ),
              )}
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  clearForm();
                  router.replace("/app/send-money");
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/55 hover:text-white text-sm font-medium transition-all"
              >
                Create New Transfer
              </button>
              <button
                onClick={() => {
                  clearForm();
                  router.replace("/app/transactions");
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                View Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Review page ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0d12] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* ── Page header ── */}
        <div className="mb-7" style={{ animation: "fadeUp 0.35s ease" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-white text-xl font-semibold tracking-tight">Review Transfer</h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Pending
                </span>
              </div>
              <p className="text-white/30 text-sm">
                Check every detail carefully before confirming — transfers cannot be reversed.
              </p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-white/25 text-xs">Reference</p>
              <p className="text-white/55 text-xs font-mono mt-0.5">{transfer.ref}</p>
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT: left column + right sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* ════ LEFT COLUMN ════════════════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* ── 1. TRANSFER AMOUNT ── */}
            <SectionCard
              title="Transfer Amount"
              subtitle="What you're sending"
              accent="emerald"
              delay={0.05}
              icon={
                <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"
                  />
                </svg>
              }
              action={<EditBtn />}
            >
              {/* Hero amount */}
              <div className="flex items-end justify-between mb-5 py-3 px-4 bg-emerald-500/[0.06] rounded-xl border border-emerald-500/15">
                <div>
                  <p className="text-white/35 text-xs mb-1">You send</p>
                  <p className="text-white text-3xl font-semibold mono tracking-tight">
                    <span className="text-white/40 text-lg mr-1">USD</span>
                    {transfer.amount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/35 text-xs mb-1">Recipient gets (indicative)</p>
                  <p className="text-emerald-400 text-xl font-semibold mono">₹ {transfer.amountInr}</p>
                </div>
              </div>

              <Row label="Purpose" value={transfer.purposeCode} />
              <Row label="Vendor / Institution Code" value={transfer.vendorCode} mono />
              <Row label="Initiated at" value={transfer.initiatedAt} />

              <Divider label="Fee Breakdown" />

              <Row label="Forex Rate" value={transfer.forexRate} mono />
              <Row label="Bank Fees" value={transfer.bankFees} mono />
              <Row label="Platform Fees" value={transfer.platformFees} mono />
              <Row label="FCCT" value={transfer.fcct} mono />

              <div className="flex items-center justify-between mt-3 py-3.5 px-4 bg-white/[0.03] rounded-xl border border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">Total Payable</span>
                  <span className="text-[10px] text-white/30 bg-white/[0.06] border border-white/[0.08] rounded-full px-2 py-0.5">
                    incl. all charges
                  </span>
                </div>
                <span className="text-emerald-400 font-bold text-lg mono">{transfer.totalPayable}</span>
              </div>
              <p className="text-white/22 text-[11px] mt-2 flex items-center gap-1.5">
                <svg
                  viewBox="0 0 12 12"
                  className="w-3 h-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <circle cx="6" cy="6" r="5" />
                  <path strokeLinecap="round" d="M6 4v3M6 8.5h.01" />
                </svg>
                TCS applicable at checkout as per Income Tax Act
              </p>
            </SectionCard>

            {/* ── 2. RECIPIENT ── */}
            <SectionCard
              title="Recipient"
              subtitle="Who receives the funds"
              accent="blue"
              delay={0.1}
              icon={
                <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                  />
                </svg>
              }
              action={<EditBtn />}
            >
              {/* Recipient identity card */}
              <div className="flex items-center gap-4 p-4 bg-blue-500/[0.05] rounded-xl border border-blue-500/15 mb-5">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-[15px] truncate">{recipient.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-white/35">{recipient.nickname}</span>
                    <span className="text-white/15">·</span>
                    <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
                      {recipient.category}
                    </span>
                    <span className="text-xs text-white/30">
                      {recipient.flag} {recipient.country}
                    </span>
                  </div>
                </div>
              </div>

              <Divider label="Address" />
              <Row label="Line 1" value={recipient.address1} />
              <Row label="Line 2" value={recipient.address2} />
              <Row label="City" value={`${recipient.city}, ${recipient.state}`} />
              <Row label="Post code" value={recipient.postalCode} mono />
              <Row label="Country" value={`${recipient.flag} ${recipient.country}`} />

              <Divider label="Bank Details" />
              <Row label="Bank" value={recipient.bankName} />
              <Row label="Transfer method" value={recipient.method} />
              <Row label="SWIFT / BIC" value={recipient.swift} mono valueClass="text-white/70" />
              <Row label="IBAN" value={recipient.iban} mono />
              <Row label="Account No." value={recipient.accountNumber} mono />
            </SectionCard>

            {/* ── 3. DOCUMENTS ── */}
            <SectionCard
              title="Supporting Documents"
              subtitle={`${documents.length} uploaded · ${documents.filter((d) => d.status === "verified").length} verified`}
              accent="violet"
              delay={0.15}
              icon={
                <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              }
              action={<EditBtn />}
            >
              <div className="flex flex-col gap-2.5">
                {documents.map((doc, i) => {
                  const st = docStatus[doc.status];
                  const fi = getFileIcon(doc.file);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                      style={{ animation: `fadeUp 0.3s ease ${0.15 + i * 0.05}s both` }}
                    >
                      {/* File type badge */}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold mono shrink-0 ${fi.cls}`}
                      >
                        {fi.label}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-white/75 text-sm font-medium">{doc.label}</p>
                          {doc.required ? (
                            <span className="text-[10px] text-red-400/70 bg-red-500/8 border border-red-500/15 px-1.5 py-0.5 rounded-full">
                              Required
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/25 bg-white/[0.05] border border-white/[0.07] px-1.5 py-0.5 rounded-full">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-white/28 text-xs mt-0.5 mono truncate">
                          {doc.file} · {doc.size}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* ── 4. SENDER ── */}
            <SectionCard
              title="Sender Details"
              subtitle="Your account information"
              accent="amber"
              delay={0.2}
              icon={
                <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            >
              <Row label="Full name" value={sender.name} />
              <Row label="Email" value={sender.email} />
              <Row label="Phone" value={sender.phone} mono />
              <Row label="PAN" value={sender.pan} mono valueClass="text-white/60" />
              <Row label="Debit account" value={`${sender.bank} · ${sender.account}`} mono />
            </SectionCard>
          </div>

          {/* ════ RIGHT SIDEBAR ══════════════════════════════ */}
          <div className="flex flex-col gap-5">
            {/* Transfer progress timeline */}
            <SectionCard
              title="Transfer Status"
              subtitle="Live progress"
              accent="emerald"
              delay={0.08}
              icon={
                <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            >
              <Timeline />
            </SectionCard>

            {/* Quick summary */}
            <SectionCard
              title="Quick Summary"
              subtitle="Key figures at a glance"
              accent="cyan"
              delay={0.13}
              icon={
                <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              }
            >
              {[
                { label: "Sending", value: `USD ${transfer.amount}`, valueClass: "text-white" },
                { label: "Forex rate", value: transfer.forexRate, valueClass: "text-white/65", mono: true },
                {
                  label: "Total payable",
                  value: transfer.totalPayable,
                  valueClass: "text-emerald-400 font-bold",
                  mono: true,
                },
                { label: "To", value: recipient.name, valueClass: "text-white/75" },
                { label: "Country", value: `${recipient.flag} ${recipient.country}` },
                { label: "Via", value: recipient.method, mono: true },
                {
                  label: "Documents",
                  value: `${documents.length} uploaded, ${documents.filter((d) => d.status === "verified").length} verified`,
                },
              ].map((r, i) => (
                <Row key={i} {...r} />
              ))}
            </SectionCard>

            {/* Confirm block */}
            <div
              className="rounded-2xl bg-[#0f1117] border border-white/[0.07] overflow-hidden shadow-xl"
              style={{ animation: "fadeUp 0.4s ease 0.18s both" }}
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              <div className="px-6 py-5 flex flex-col gap-4">
                {/* Warning note */}
                <div className="flex gap-2.5 bg-amber-500/[0.07] border border-amber-500/20 rounded-xl p-3.5">
                  <svg
                    viewBox="0 0 16 16"
                    className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <p className="text-amber-300/70 text-xs leading-relaxed">
                    Transfers are <span className="text-amber-300 font-semibold">irreversible</span> once processed.
                    Verify all details carefully.
                  </p>
                </div>

                {/* Checkbox agreement */}
                <button
                  type="button"
                  onClick={() => setAgreed((v) => !v)}
                  className="flex items-start gap-2.5 text-left group"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                    ${agreed ? "bg-emerald-500 border-emerald-500" : "border-white/20 group-hover:border-white/40"}`}
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
                    className={`text-xs leading-relaxed transition-colors ${agreed ? "text-white/55" : "text-white/30 group-hover:text-white/45"}`}
                  >
                    I confirm all recipient and transfer details are accurate, and I authorise FinVault to process this
                    remittance under LRS regulations.
                  </p>
                </button>

                {/* Confirm CTA */}
                <button
                  onClick={handleConfirm}
                  disabled={!agreed || loading}
                  className={[
                    "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    agreed && !loading
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                      : "bg-white/[0.06] border border-white/[0.08] text-white/30 cursor-not-allowed",
                  ].join(" ")}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      Confirm & Send
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

                <p className="text-center text-white/18 text-[11px] flex items-center justify-center gap-1.5">
                  <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="2" y="5" width="8" height="6" rx="1" />
                    <path strokeLinecap="round" d="M4 5V3.5a2 2 0 014 0V5" />
                  </svg>
                  256-bit SSL encrypted · RBI LRS compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
