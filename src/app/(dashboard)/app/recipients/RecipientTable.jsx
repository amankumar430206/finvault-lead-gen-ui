"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`;

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────
const MOCK_RECIPIENTS = [
  {
    id: "1",
    name: "University of Melbourne",
    nickname: "UniMelb",
    category: "institution",
    country: "AU",
    flag: "🇦🇺",
    bank: "Commonwealth Bank",
    swift: "CTBAAU2SXXX",
    iban: "AU12 3456 7890 1234",
    accountMasked: "••••4521",
    currency: "AUD",
    lastTransfer: "2026-02-18",
    totalTransfers: 4,
    status: "verified",
  },
  {
    id: "2",
    name: "James Carter",
    nickname: "Brother",
    category: "individual",
    country: "US",
    flag: "🇺🇸",
    bank: "Chase Bank",
    swift: "CHASUS33XXX",
    iban: "",
    accountMasked: "••••7823",
    currency: "USD",
    lastTransfer: "2026-01-05",
    totalTransfers: 12,
    status: "verified",
  },
  {
    id: "3",
    name: "Flywire Payments",
    nickname: "Flywire",
    category: "flywire",
    country: "GB",
    flag: "🇬🇧",
    bank: "Barclays Bank",
    swift: "BARCGB22XXX",
    iban: "GB29 NWBK 6016 1331 9268 19",
    accountMasked: "••••3310",
    currency: "GBP",
    lastTransfer: "2025-12-20",
    totalTransfers: 2,
    status: "verified",
  },
  {
    id: "4",
    name: "Sarah Mitchell",
    nickname: "Landlord",
    category: "individual",
    country: "CA",
    flag: "🇨🇦",
    bank: "Royal Bank of Canada",
    swift: "ROYCCAT2XXX",
    iban: "",
    accountMasked: "••••9910",
    currency: "CAD",
    lastTransfer: "2026-03-01",
    totalTransfers: 8,
    status: "pending",
  },
  {
    id: "5",
    name: "TU Munich - Finance",
    nickname: "TUM",
    category: "institution",
    country: "DE",
    flag: "🇩🇪",
    bank: "Deutsche Bank",
    swift: "DEUTDEDBXXX",
    iban: "DE89 3704 0044 0532 0130 00",
    accountMasked: "••••2244",
    currency: "EUR",
    lastTransfer: "2025-11-14",
    totalTransfers: 1,
    status: "verified",
  },
  {
    id: "6",
    name: "Priya Sharma",
    nickname: "Sister",
    category: "individual",
    country: "SG",
    flag: "🇸🇬",
    bank: "DBS Bank",
    swift: "DBSSSGSGXXX",
    iban: "",
    accountMasked: "••••5567",
    currency: "SGD",
    lastTransfer: "2026-02-28",
    totalTransfers: 6,
    status: "verified",
  },
];

const CATEGORIES = [
  { id: "institution", label: "Institution", color: "emerald" },
  { id: "flywire", label: "Flywire", color: "blue" },
  { id: "individual", label: "Individual", color: "violet" },
];

const COUNTRIES = [
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD" },
  { code: "AE", name: "UAE", flag: "🇦🇪", currency: "AED" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", currency: "NZD" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR" },
];

const CATEGORY_STYLES = {
  institution: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  flywire: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  individual: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
};

// ─────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-white/38 uppercase tracking-widest mb-1.5">
    {children}
    {required && <span className="text-emerald-400 ml-0.5">*</span>}
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
  `w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-150
  ${err ? "border-red-500/45" : "border-white/[0.08] focus:border-emerald-500/45 focus:bg-emerald-500/[0.03]"}`;

const Field = ({ label, required, error, children, className = "" }) => (
  <div className={className}>
    {label && <Label required={required}>{label}</Label>}
    {children}
    {error && <Err msg={error?.message} />}
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
          ${error ? "border-red-500/45" : open ? "border-emerald-500/45 bg-emerald-500/[0.03]" : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15]"}
          ${sel ? "text-white" : "text-white/25"}`}
      >
        <span className="flex items-center gap-2">
          {sel?.flag && <span>{sel.flag}</span>}
          {sel ? (sel.label ?? sel) : placeholder}
        </span>
        <svg
          viewBox="0 0 10 6"
          className={`w-3 h-1.5 text-white/25 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" d="M1 1l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-white/[0.08] bg-[#13161f] shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
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
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2
                  ${v === value ? "text-emerald-400 bg-emerald-500/10" : "text-white/60 hover:text-white hover:bg-white/[0.05]"}`}
              >
                {opt.flag && <span>{opt.flag}</span>}
                {l}
                {v === value && <span className="ml-auto text-emerald-400 text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Avatar initials
const Avatar = ({ name, size = "md" }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors = [
    "from-emerald-500/20 to-emerald-500/5",
    "from-blue-500/20 to-blue-500/5",
    "from-violet-500/20 to-violet-500/5",
    "from-amber-500/20 to-amber-500/5",
    "from-cyan-500/20 to-cyan-500/5",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sz = size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-xs";
  return (
    <div
      className={`${sz} rounded-xl bg-gradient-to-br ${color} border border-white/[0.08] flex items-center justify-center font-bold text-white/60 shrink-0`}
    >
      {initials}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DELETE CONFIRM MODAL
// ─────────────────────────────────────────────────────────────
const DeleteModal = ({ recipient, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
    <div
      className="relative w-full max-w-sm rounded-2xl bg-[#0f1117] border border-white/[0.08] shadow-2xl overflow-hidden"
      style={{ animation: "fadeUp .25s ease" }}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      <div className="p-6 flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg viewBox="0 0 20 20" className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold">Delete recipient?</p>
          <p className="text-white/40 text-sm mt-1 leading-relaxed">
            <span className="text-white/65 font-medium">{recipient.name}</span> will be permanently removed. This cannot
            be undone.
          </p>
        </div>
        <div className="flex gap-2.5 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white text-sm font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-all shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// ADD / EDIT DRAWER
// ─────────────────────────────────────────────────────────────
const RecipientDrawer = ({ recipient, onSave, onClose }) => {
  const isEdit = !!recipient;
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: recipient
      ? {
          name: recipient.name,
          nickname: recipient.nickname,
          category: recipient.category,
          country: recipient.country,
          bank: recipient.bank,
          swift: recipient.swift,
          iban: recipient.iban,
          account: "",
        }
      : {
          name: "",
          nickname: "",
          category: "",
          country: "",
          bank: "",
          swift: "",
          iban: "",
          account: "",
        },
  });

  const category = watch("category");
  const country = watch("country");

  // auto-fill currency when country changes
  const countryOpts = COUNTRIES.map((c) => ({ value: c.code, label: `${c.name} (${c.currency})`, flag: c.flag }));

  const onSubmit = (data) => onSave(data);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md h-full bg-[#0f1117] border-l border-white/[0.07] shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideInRight .3s ease" }}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/45 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-white font-semibold text-base">{isEdit ? "Edit Recipient" : "Add Recipient"}</h2>
            <p className="text-white/30 text-xs mt-0.5">
              {isEdit ? `Editing ${recipient.name}` : "Add a new recipient to your list"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/35 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" d="M2 2l6 6M8 2L2 8" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Category */}
            <div>
              <Label required>Category</Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Select a category" }}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => {
                      const active = field.value === cat.id;
                      const s = CATEGORY_STYLES[cat.id];
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => field.onChange(cat.id)}
                          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all
                            ${active ? `${s.bg} ${s.border} border` : "bg-white/[0.03] border-white/[0.07] hover:border-white/[0.15]"}`}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          <p className={`text-xs font-semibold ${active ? s.text : "text-white/40"}`}>{cat.label}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              <Err msg={errors.category?.message} />
            </div>

            {/* Name + Nickname */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" required error={errors.name}>
                <input
                  {...register("name", { required: "Required" })}
                  placeholder="Jane Doe"
                  className={inp(errors.name)}
                />
              </Field>
              <Field label="Nickname" error={errors.nickname}>
                <input {...register("nickname")} placeholder="e.g. Sister" className={inp(false)} />
              </Field>
            </div>

            {/* Country */}
            <Field label="Country" required error={errors.country}>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <Dropdown {...field} options={countryOpts} placeholder="Select country" error={errors.country} />
                )}
              />
            </Field>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-white/20 text-[10px] uppercase tracking-widest font-semibold">Bank details</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            {/* Bank name */}
            <Field label="Bank name" required error={errors.bank}>
              <input
                {...register("bank", { required: "Required" })}
                placeholder="e.g. Commonwealth Bank"
                className={inp(errors.bank)}
              />
            </Field>

            {/* SWIFT */}
            <Field label="SWIFT / BIC code" required error={errors.swift}>
              <div
                className={`flex items-stretch rounded-xl border overflow-hidden transition-all ${errors.swift ? "border-red-500/45" : "border-white/[0.08] focus-within:border-emerald-500/45"}`}
              >
                <div className="flex items-center bg-white/[0.04] border-r border-white/[0.08] px-3 shrink-0">
                  <span className="text-white/25 text-[10px] font-bold tracking-wider">SWIFT</span>
                </div>
                <input
                  {...register("swift", {
                    required: "Required",
                    pattern: { value: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i, message: "Invalid SWIFT" },
                  })}
                  placeholder="CTBAAU2SXXX"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/20 text-sm px-3.5 py-3 mono uppercase"
                />
              </div>
              <Err msg={errors.swift?.message} />
            </Field>

            {/* IBAN */}
            <Field label="IBAN" error={errors.iban}>
              <div className="flex items-stretch rounded-xl border border-white/[0.08] focus-within:border-emerald-500/45 overflow-hidden">
                <div className="flex items-center bg-white/[0.04] border-r border-white/[0.08] px-3 shrink-0">
                  <span className="text-white/25 text-[10px] font-bold tracking-wider">IBAN</span>
                </div>
                <input
                  {...register("iban")}
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/20 text-sm px-3.5 py-3 mono"
                />
              </div>
            </Field>

            {/* Account number (individual only) */}
            {category === "individual" && (
              <Field label="Account number" required error={errors.account}>
                <input
                  {...register("account", { required: category === "individual" ? "Required" : false })}
                  placeholder="XXXXXXXXXXXX"
                  className={`${inp(errors.account)} mono`}
                />
              </Field>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 mt-1"
            >
              {isEdit ? (
                <>
                  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.5 2.5l-9 9V13h1.5l9-9-1.5-1.5zM10 4l1.5 1.5"
                    />
                  </svg>
                  Save changes
                </>
              ) : (
                <>
                  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 2v10M2 7h10" />
                  </svg>
                  Add recipient
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// RECIPIENT DETAIL PANEL
// ─────────────────────────────────────────────────────────────
const DetailPanel = ({ recipient, onEdit, onDelete, onClose }) => {
  const cat = CATEGORIES.find((c) => c.id === recipient.category);
  const s = CATEGORY_STYLES[recipient.category];
  const country = COUNTRIES.find((c) => c.code === recipient.country);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm h-full bg-[#0f1117] border-l border-white/[0.07] shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideInRight .28s ease" }}
      >
        <div
          className={`h-px w-full bg-gradient-to-r from-transparent ${s.text.replace("text-", "via-").replace("400", "500")}/40 to-transparent`}
        />

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.06] flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={recipient.name} size="lg" />
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{recipient.name}</p>
              {recipient.nickname && <p className="text-white/35 text-xs mt-0.5">"{recipient.nickname}"</p>}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${s.bg} ${s.text} ${s.border}`}
                >
                  {cat?.icon} {cat?.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold
                  ${recipient.status === "verified" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
                >
                  {recipient.status === "verified" ? "✓ Verified" : "⏳ Pending"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white transition-colors shrink-0"
          >
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" d="M2 2l6 6M8 2L2 8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Last transfer", value: recipient.lastTransfer },
              { label: "Total transfers", value: `${recipient.totalTransfers} times` },
              { label: "Currency", value: `${recipient.flag} ${recipient.currency}` },
              { label: "Country", value: `${country?.flag} ${country?.name}` },
            ].map((stat) => (
              <div key={stat.label} className="px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-white/28 text-[10px] uppercase tracking-wider font-semibold">{stat.label}</p>
                <p className="text-white/70 text-sm font-medium mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Bank details */}
          <div>
            <p className="text-[10px] font-bold text-white/22 uppercase tracking-widest mb-2">Bank details</p>
            <div className="bg-white/[0.025] rounded-xl border border-white/[0.05] px-4 divide-y divide-white/[0.04]">
              {[
                ["Bank", recipient.bank, false],
                ["SWIFT", recipient.swift, true],
                ["IBAN", recipient.iban || "N/A", true],
                ["Account", recipient.accountMasked, true],
              ].map(([k, v, mono]) => (
                <div key={k} className="flex justify-between items-center py-2.5 gap-4">
                  <span className="text-white/30 text-xs shrink-0">{k}</span>
                  <span className={`text-xs font-medium text-white/65 text-right ${mono ? "font-mono" : ""}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex gap-2.5">
          <button
            onClick={() => onEdit(recipient)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.09] text-sm font-medium transition-all"
          >
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 2.5l-9 9V13h1.5l9-9-1.5-1.5z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(recipient)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 hover:bg-red-500/15 text-sm font-medium transition-all"
          >
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M4 3.5l.667 8h4.666L10 3.5"
              />
            </svg>
            Delete
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20">
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h10M7 2l5 5-5 5" />
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function ManageRecipients() {
  const [recipients, setRecipients] = useState(MOCK_RECIPIENTS);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [drawer, setDrawer] = useState(null); // null | "add" | recipient obj (edit)
  const [detail, setDetail] = useState(null); // recipient obj
  const [delTarget, setDelTarget] = useState(null); // recipient obj
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = recipients.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.nickname?.toLowerCase().includes(search.toLowerCase()) ||
      r.bank.toLowerCase().includes(search.toLowerCase()) ||
      r.country.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || r.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleSave = (data) => {
    if (drawer && drawer !== "add") {
      // Edit
      setRecipients((prev) =>
        prev.map((r) =>
          r.id === drawer.id
            ? {
                ...r,
                name: data.name,
                nickname: data.nickname,
                category: data.category,
                country: data.country,
                bank: data.bank,
                swift: data.swift,
                iban: data.iban,
                flag: COUNTRIES.find((c) => c.code === data.country)?.flag ?? r.flag,
                currency: COUNTRIES.find((c) => c.code === data.country)?.currency ?? r.currency,
              }
            : r,
        ),
      );
      showToast(`${data.name} updated successfully`);
    } else {
      // Add
      const country = COUNTRIES.find((c) => c.code === data.country);
      setRecipients((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: data.name,
          nickname: data.nickname,
          category: data.category,
          country: data.country,
          flag: country?.flag ?? "🌍",
          bank: data.bank,
          swift: data.swift,
          iban: data.iban,
          accountMasked: "••••" + Math.floor(1000 + Math.random() * 9000),
          currency: country?.currency ?? "USD",
          lastTransfer: "—",
          totalTransfers: 0,
          status: "pending",
        },
      ]);
      showToast(`${data.name} added successfully`);
    }
    setDrawer(null);
    setDetail(null);
  };

  const handleDelete = () => {
    setRecipients((prev) => prev.filter((r) => r.id !== delTarget.id));
    showToast(`${delTarget.name} removed`, "error");
    setDelTarget(null);
    setDetail(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6 fu">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 20 20"
                className="w-4.5 h-4.5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-semibold text-xl tracking-tight">Recipients</h1>
              <p className="text-white/30 text-xs mt-0.5">{recipients.length} saved recipients</p>
            </div>
          </div>
          <button
            onClick={() => setDrawer("add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
          >
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" d="M7 2v10M2 7h10" />
            </svg>
            Add recipient
          </button>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 fu" style={{ animationDelay: ".05s" }}>
          {/* Search */}
          <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] focus-within:border-emerald-500/40 transition-all">
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 text-white/25 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="6.5" cy="6.5" r="4.5" />
              <path strokeLinecap="round" d="M10 10l3 3" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, bank or country…"
              className="flex-1 bg-transparent outline-none text-white/80 text-sm placeholder:text-white/20"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-white/25 hover:text-white/55 transition-colors">
                <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" d="M2 2l6 6M8 2L2 8" />
                </svg>
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            {[{ id: "all", label: "All" }, ...CATEGORIES].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${filterCat === cat.id ? "bg-white/[0.09] text-white" : "text-white/35 hover:text-white/60"}`}
              >
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipients list */}
        <div
          className="rounded-2xl bg-[#0f1117] border border-white/[0.07] overflow-hidden shadow-2xl fu"
          style={{ animationDelay: ".1s" }}
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <svg
                  viewBox="0 0 20 20"
                  className="w-5 h-5 text-white/20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <p className="text-white/30 text-sm">No recipients found</p>
              {search && <p className="text-white/18 text-xs">Try adjusting your search</p>}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((r, i) => {
                const cat = CATEGORIES.find((c) => c.id === r.category);
                const s = CATEGORY_STYLES[r.category];
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.025] transition-all cursor-pointer group"
                    style={{ animation: `fadeUp .3s ease both`, animationDelay: `${i * 0.04}s` }}
                    onClick={() => setDetail(r)}
                  >
                    {/* Avatar */}
                    <Avatar name={r.name} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white/85 font-medium text-sm">{r.name}</p>
                        {r.nickname && <span className="text-white/28 text-xs">"{r.nickname}"</span>}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${s.bg} ${s.text} ${s.border}`}
                        >
                          {cat?.icon} {cat?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-white/30 text-xs flex items-center gap-1">
                          {r.flag} {COUNTRIES.find((c) => c.code === r.country)?.name ?? r.country}
                        </span>
                        <span className="text-white/15 text-xs">·</span>
                        <span className="text-white/30 text-xs mono">{r.swift}</span>
                        <span className="text-white/15 text-xs">·</span>
                        <span className="text-white/30 text-xs mono">{r.accountMasked}</span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Status */}
                      <span
                        className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium
                        ${r.status === "verified" ? "text-emerald-400" : "text-amber-400"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${r.status === "verified" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}
                        />
                        {r.status === "verified" ? "Verified" : "Pending"}
                      </span>

                      {/* Transfer count */}
                      <div className="hidden sm:block text-right">
                        <p className="text-white/60 text-xs font-semibold mono">{r.totalTransfers}×</p>
                        <p className="text-white/22 text-[10px]">transfers</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrawer(r);
                          }}
                          className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/35 hover:text-white transition-colors"
                        >
                          <svg
                            viewBox="0 0 12 12"
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 2l-8 8V11h1l8-8-1-1z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDelTarget(r);
                          }}
                          className="w-7 h-7 rounded-lg bg-red-500/[0.06] border border-red-500/15 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          <svg
                            viewBox="0 0 12 12"
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h8M5 3V2h2v1M3.5 3l.5 7h4l.5-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Chevron */}
                      <svg
                        viewBox="0 0 8 14"
                        className="w-2 h-3 text-white/15 group-hover:text-white/35 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l6 6-6 6" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/15 text-xs mt-4">
          Click a recipient to view details · Hover to edit or delete
        </p>
      </div>

      {/* Overlays */}
      {drawer !== null && (
        <RecipientDrawer
          recipient={drawer === "add" ? null : drawer}
          onSave={handleSave}
          onClose={() => setDrawer(null)}
        />
      )}

      {detail && !drawer && (
        <DetailPanel
          recipient={detail}
          onEdit={(r) => {
            setDetail(null);
            setDrawer(r);
          }}
          onDelete={(r) => {
            setDetail(null);
            setDelTarget(r);
          }}
          onClose={() => setDetail(null)}
        />
      )}

      {delTarget && <DeleteModal recipient={delTarget} onConfirm={handleDelete} onCancel={() => setDelTarget(null)} />}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium z-[100]
            ${
              toast.type === "error"
                ? "bg-[#1a0f0f] border-red-500/25 text-red-400"
                : "bg-[#0a1a12] border-emerald-500/25 text-emerald-400"
            }`}
          style={{ animation: "toastIn .25s ease" }}
        >
          {toast.type === "error" ? (
            <svg viewBox="0 0 14 14" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h10M4.5 3V2h5v1M3 3l.667 9h6.666L11 3" />
            </svg>
          ) : (
            <svg viewBox="0 0 14 14" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l3.5 3.5 6.5-7" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
