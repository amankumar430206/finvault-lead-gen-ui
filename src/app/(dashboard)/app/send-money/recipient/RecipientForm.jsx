import { useSendMoneyForm } from "@/store/form.store";
import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
`;

// ── Country list (abbreviated) ────────────────────────────
const COUNTRIES = [
  "India",
  "UAE",
  "Canada",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Singapore",
  "Japan",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "New Zealand",
  "Brazil",
  "South Africa",
];

// ── Category config ───────────────────────────────────────
const CATEGORIES = [
  {
    id: "institution",
    label: "Institution",
    description: "Universities, hospitals, government bodies",
    icon: (
      <svg viewBox="0 0 22 22" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 21h16.5M4.5 3h15l-1.5 11.25H6L4.5 3zM9 7.5h4.5M9 11.25h4.5M11.25 3V1.5"
        />
      </svg>
    ),
  },
  {
    id: "flywire",
    label: "Flywire",
    description: "Education payment platform",
    icon: (
      <svg viewBox="0 0 22 22" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l10 8-10 8V3z" />
      </svg>
    ),
  },
  {
    id: "individual",
    label: "Individual",
    description: "Personal bank accounts",
    icon: (
      <svg viewBox="0 0 22 22" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
];

// ── Steps ─────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Recipient", short: "Who" },
  { id: 2, label: "Address", short: "Where" },
  { id: 3, label: "Bank Info", short: "Bank" },
  { id: 4, label: "Review", short: "Done" },
];

// ─────────────────────────────────────────────────────────────
// SHARED FIELD PRIMITIVES
// ─────────────────────────────────────────────────────────────

const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-primary/40 uppercase tracking-widest mb-1.5">
    {children}
    {required && <span className="text-accent ml-0.5">*</span>}
  </label>
);

const FieldWrap = ({ error, children }) => (
  <div>
    {children}
    {error && (
      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
        <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6" cy="6" r="5" />
          <path strokeLinecap="round" d="M6 4v3M6 8.5h.01" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

const inputBase = (err) =>
  `w-full bg-inputbg border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-[var(--text-muted)] outline-none transition-all duration-200
  ${
    err
      ? "border-red-500/50 focus:border-red-500/70"
      : " border-[var(--border-clr)] focus: border-[var(--border-clr)] focus:bg-accent/[0.03]"
  }`;

const Field = ({ label, required, error, children }) => (
  <FieldWrap error={error}>
    <Label required={required}>{label}</Label>
    {children}
  </FieldWrap>
);

// Custom Select
const SelectField = ({ value, onChange, onBlur, options, placeholder, error }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        onBlur={onBlur}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200
          ${error ? "border-red-500/50 bg-red-500/5" : open ? "border-emerald-500/45 bg-accent/[0.03]" : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)]"}
          ${selected ? "text-primary" : "text-primary/70"}`}
      >
        {selected?.label ?? placeholder}
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
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                ${opt.value === value ? "text-accent bg-accent/10" : "text-primary/65 hover:text-primary hover:bg-inputbg"}`}
            >
              {opt.label}
              {opt.value === value && <span className="text-accent text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────
const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {STEPS.map((step, i) => {
      const done = step.id < current;
      const active = step.id === current;
      const upcoming = step.id > current;
      return (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
              ${done ? "bg-accent border-emerald-500 text-primary" : ""}
              ${active ? "bg-accent/10 border-emerald-500 text-accent" : ""}
              ${upcoming ? "bg-transparent  border-[var(--border-clr)] text-primary/70" : ""}`}
            >
              {done ? (
                <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" d="M2.5 7l3.5 3.5 5.5-7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-[10px] font-medium hidden sm:block ${active ? "text-accent" : done ? "text-primary/45" : "text-primary/20"}`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 sm:w-16 h-px mx-1 mb-5 transition-all duration-500 ${done ? "bg-accent/60" : "bg-inputbg"}`}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// REVIEW ROW
// ─────────────────────────────────────────────────────────────
const ReviewRow = ({ label, value, mono }) => (
  <div className="flex items-start justify-between py-3 border-b  border-[var(--border-clr)] last:border-0 gap-4 px-3">
    <span className="text-primary/50 text-sm shrink-0">{label}</span>
    <span className={`text-sm font-medium text-right ${mono ? "font-mono text-primary/70" : "text-primary/75"}`}>
      {value || "—"}
    </span>
  </div>
);

const ReviewSection = ({ title, children }) => (
  <div className="mb-5 last:mb-0">
    <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-2">{title}</p>
    <div className="bg-inputbg rounded-xl border  border-[var(--border-clr)] px-4 overflow-hidden">{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function AddRecipientPage() {
  const { transaction, setRecipient, recipient, remitter, user } = useSendMoneyForm((s) => s);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      recipientName: "",
      category: "",
      nickname: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      bankName: "",
      swift: "",
      iban: "",
      routingNumber: "",
      accountNumber: "",
      ...(recipient && recipient),
    },
  });

  const category = watch("category");
  const allValues = watch();

  // ── Validate current step fields then advance ─────────────
  const advance = async () => {
    const fieldsPerStep = {
      1: ["recipientName", "category"],
      2: ["addressLine1", "city", "country"],
      3: category === "individual" ? ["bankName", "accountNumber"] : ["bankName", "swift"],
    };
    const valid = await trigger(fieldsPerStep[step] ?? []);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (data) => {
    setLoading(true);
    setRecipient(data);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1800);
  };

  // ── Success screen ────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-md">
          <div className="h-px w-full bg-gradient-to-r from-bg-card via-accent/80 from-bg-card" />
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-emerald-500/25 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-accent"
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
            <div>
              <h2 className="text-primary text-xl font-semibold">Recipient Saved</h2>
              <p className="text-primary/40 text-sm mt-1.5">
                <span className="text-primary/65 font-medium">{allValues.recipientName}</span> has been added to your
                recipients.
              </p>
            </div>
            <div className="w-full bg-inputbg rounded-xl border  border-[var(--border-clr)] divide-y divide-white/[0.04] text-left">
              <ReviewRow label="Category" value={CATEGORIES.find((c) => c.id === allValues.category)?.label} />
              <ReviewRow label="Country" value={allValues.country} />
              <ReviewRow label="SWIFT / BIC" value={allValues.swift} mono />
            </div>
            <Link
              href={"/app/send-money/documents"}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent/80 text-white font-semibold text-sm transition-all shadow-md shadow-accent/30"
            >
              Upload Documents
            </Link>
            <button
              onClick={() => {
                setDone(false);
                setStep(1);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/55 hover:text-primary hover:bg-inputbg text-sm font-medium transition-all"
            >
              Edit Recipient
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex items-start justify-center p-4 md:p-8">
      <div className="w-full max-w-[560px] mt-4">
        {/* Page heading */}
        <div className="mb-6 fade-up">
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
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </div>
            <h1 className="text-primary font-semibold text-lg tracking-tight">Add Recipient</h1>
          </div>
          <p className="text-primary/50 text-sm ml-11">Set up a new international transfer recipient</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-md fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="h-px w-full bg-gradient-to-r from-bg-card via-[var(--accent-glow)] from-bg-card" />

          <div className="px-7 pt-7 pb-6">
            <StepIndicator current={step} />

            {/* ══ STEP 1: RECIPIENT ══════════════════════════════ */}
            {step === 1 && (
              <div className="fade-up flex flex-col gap-5">
                <div>
                  <h2 className="text-primary font-semibold text-[16px]">Recipient details</h2>
                  <p className="text-primary/50 text-sm mt-0.5">Who are you sending money to?</p>
                </div>

                {/* Name */}
                <Field label="Recipient full name / organisation" required error={errors.recipientName?.message}>
                  <input
                    placeholder="e.g. University of Melbourne"
                    {...register("recipientName", { required: "Recipient name is required" })}
                    className={inputBase(errors.recipientName)}
                  />
                </Field>

                {/* Nickname */}
                <Field label="Nickname (optional)">
                  <input placeholder="e.g. Uni fees" {...register("nickname")} className={inputBase(false)} />
                </Field>

                {/* Category */}
                <FieldWrap error={errors.category?.message}>
                  <Label required>Recipient type</Label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Please select a recipient type" }}
                    render={({ field }) => (
                      <div className="grid grid-cols-3 gap-2.5 mt-0.5">
                        {CATEGORIES.map((cat) => {
                          const active = field.value === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => field.onChange(cat.id)}
                              className={[
                                "flex flex-col items-center gap-2.5 p-4 rounded-xl border text-center transition-all duration-200",
                                active
                                  ? " border-[var(--border-clr)] bg-accent/[0.08] text-accent"
                                  : " border-[var(--border-clr)] bg-inputbg text-primary/40 hover: border-[var(--border-clr)] hover:bg-inputbg hover:text-primary/70",
                              ].join(" ")}
                            >
                              <span className={active ? "text-accent" : ""}>{cat.icon}</span>
                              <div>
                                <p className={`text-xs font-semibold ${active ? "text-primary" : ""}`}>{cat.label}</p>
                                <p className="text-[10px] text-primary/70 mt-0.5 leading-tight">{cat.description}</p>
                              </div>
                              {active && (
                                <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
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
                      </div>
                    )}
                  />
                </FieldWrap>
              </div>
            )}

            {/* ══ STEP 2: ADDRESS ════════════════════════════════ */}
            {step === 2 && (
              <div className="fade-up flex flex-col gap-4">
                <div>
                  <h2 className="text-primary font-semibold text-[16px]">Address</h2>
                  <p className="text-primary/50 text-sm mt-0.5">Recipient's registered address</p>
                </div>

                <Field label="Address line 1" required error={errors.addressLine1?.message}>
                  <input
                    placeholder="Street address, P.O. box"
                    {...register("addressLine1", { required: "Address is required" })}
                    className={inputBase(errors.addressLine1)}
                  />
                </Field>

                <Field label="Address line 2">
                  <input
                    placeholder="Apartment, suite, unit, building (optional)"
                    {...register("addressLine2")}
                    className={inputBase(false)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="City" required error={errors.city?.message}>
                    <input
                      placeholder="Melbourne"
                      {...register("city", { required: "City is required" })}
                      className={inputBase(errors.city)}
                    />
                  </Field>
                  <Field label="State / Province">
                    <input placeholder="Victoria" {...register("state")} className={inputBase(false)} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Postal code">
                    <input placeholder="3000" {...register("postalCode")} className={inputBase(false)} />
                  </Field>
                  <FieldWrap error={errors.country?.message}>
                    <Label required>Country</Label>
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field }) => (
                        <SelectField
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          error={errors.country}
                          placeholder="Select country"
                          options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                        />
                      )}
                    />
                  </FieldWrap>
                </div>
              </div>
            )}

            {/* ══ STEP 3: BANK INFO ══════════════════════════════ */}
            {step === 3 && (
              <div className="fade-up flex flex-col gap-4">
                <div>
                  <h2 className="text-primary font-semibold text-[16px]">Bank information</h2>
                  <p className="text-primary/50 text-sm mt-0.5">
                    {category === "individual" ? "Personal bank account details" : "Institution banking details"}
                  </p>
                </div>

                <Field label="Bank name" required error={errors.bankName?.message}>
                  <input
                    placeholder="e.g. Commonwealth Bank of Australia"
                    {...register("bankName", { required: "Bank name is required" })}
                    className={inputBase(errors.bankName)}
                  />
                </Field>

                {/* SWIFT / BIC */}
                <Field label="SWIFT / BIC code" required={category !== "individual"} error={errors.swift?.message}>
                  <div
                    className={`flex items-stretch rounded-xl border overflow-hidden transition-all duration-200
                    ${errors.swift ? "border-red-500/50" : " border-[var(--border-clr)] focus-within:border-emerald-500/45"}`}
                  >
                    <div className="flex items-center bg-inputbg border-r  border-[var(--border-clr)] px-3.5">
                      <span className="text-primary/50 text-xs font-mono font-semibold">SWIFT</span>
                    </div>
                    <input
                      placeholder="e.g. CTBAAU2S"
                      {...register("swift", {
                        required: category !== "individual" ? "SWIFT/BIC is required" : false,
                        pattern: {
                          value: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i,
                          message: "Enter a valid SWIFT/BIC code (8 or 11 characters)",
                        },
                        setValueAs: (v) => v.toUpperCase(),
                      })}
                      className="flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm px-4 py-3 mono"
                    />
                  </div>
                  {errors.swift && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="6" cy="6" r="5" />
                        <path strokeLinecap="round" d="M6 4v3M6 8.5h.01" />
                      </svg>
                      {errors.swift.message}
                    </p>
                  )}
                </Field>

                {/* IBAN */}
                <Field label="IBAN" error={errors.iban?.message}>
                  <div
                    className={`flex items-stretch rounded-xl border overflow-hidden transition-all duration-200
                    ${errors.iban ? "border-red-500/50" : " border-[var(--border-clr)] focus-within:border-emerald-500/45"}`}
                  >
                    <div className="flex items-center bg-inputbg border-r  border-[var(--border-clr)] px-3.5">
                      <span className="text-primary/50 text-xs font-mono font-semibold">IBAN</span>
                    </div>
                    <input
                      placeholder="e.g. GB29 NWBK 6016 1331 9268 19"
                      {...register("iban", {
                        pattern: {
                          value: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/i,
                          message: "Enter a valid IBAN",
                        },
                        setValueAs: (v) => v.replace(/\s/g, "").toUpperCase(),
                      })}
                      className="flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm px-4 py-3 mono"
                    />
                  </div>
                  {errors.iban && <p className="text-red-400 text-xs mt-1.5">{errors.iban.message}</p>}
                </Field>

                {/* Individual-only fields */}
                {category === "individual" && (
                  <div className="grid grid-cols-2 gap-3 fade-in">
                    <Field label="Routing number" error={errors.routingNumber?.message}>
                      <input
                        placeholder="021000021"
                        {...register("routingNumber", {
                          pattern: { value: /^\d{9}$/, message: "Must be 9 digits" },
                        })}
                        className={`${inputBase(errors.routingNumber)} mono`}
                      />
                    </Field>
                    <Field label="Account number" required error={errors.accountNumber?.message}>
                      <input
                        placeholder="000123456789"
                        {...register("accountNumber", {
                          required: category === "individual" ? "Account number is required" : false,
                        })}
                        className={`${inputBase(errors.accountNumber)} mono`}
                      />
                    </Field>
                  </div>
                )}

                {/* Info note */}
                <div className="flex gap-3 rounded-xl bg-blue-500/[0.07] border border-blue-500/20 p-3.5 mt-1">
                  <svg
                    viewBox="0 0 16 16"
                    className="w-4 h-4 text-blue-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <circle cx="8" cy="8" r="6.5" />
                    <path strokeLinecap="round" d="M8 7v4M8 5.5h.01" />
                  </svg>
                  <p className="text-blue-300/70 text-xs leading-relaxed">
                    Bank details are encrypted and stored securely. We never share this data with third parties.
                  </p>
                </div>
              </div>
            )}

            {/* ══ STEP 4: REVIEW ═════════════════════════════════ */}
            {step === 4 && (
              <div className="fade-up flex flex-col gap-5">
                <div>
                  <h2 className="text-primary font-semibold text-[16px]">Review & confirm</h2>
                  <p className="text-primary/50 text-sm mt-0.5">Check the details before saving</p>
                </div>

                <ReviewSection title="Recipient">
                  <ReviewRow label="Full name" value={allValues.recipientName} />
                  <ReviewRow label="Nickname" value={allValues.nickname} />
                  <ReviewRow label="Type" value={CATEGORIES.find((c) => c.id === allValues.category)?.label} />
                </ReviewSection>

                <ReviewSection title="Address">
                  <ReviewRow label="Line 1" value={allValues.addressLine1} />
                  {allValues.addressLine2 && <ReviewRow label="Line 2" value={allValues.addressLine2} />}
                  <ReviewRow label="City" value={[allValues.city, allValues.state].filter(Boolean).join(", ")} />
                  <ReviewRow label="Post code" value={allValues.postalCode} />
                  <ReviewRow label="Country" value={allValues.country} />
                </ReviewSection>

                <ReviewSection title="Bank details">
                  <ReviewRow label="Bank" value={allValues.bankName} />
                  <ReviewRow label="SWIFT" value={allValues.swift} mono />
                  {allValues.iban && <ReviewRow label="IBAN" value={allValues.iban} mono />}
                  {allValues.routingNumber && <ReviewRow label="Routing" value={allValues.routingNumber} mono />}
                  {allValues.accountNumber && (
                    <ReviewRow label="Account" value={`•••• ${allValues.accountNumber.slice(-4)}`} mono />
                  )}
                </ReviewSection>

                <div className="flex gap-3 rounded-xl bg-accent/[0.06] border  border-[var(--border-clr)] p-3.5">
                  <svg
                    viewBox="0 0 16 16"
                    className="w-4 h-4 text-accent shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 10.5l-1.5 1.5-1.5-1.5M9.75 12V9M4.5 13.5h7a1.5 1.5 0 001.5-1.5V6l-3-3h-6a1.5 1.5 0 00-1.5 1.5v9a1.5 1.5 0 001.5 1.5z"
                    />
                  </svg>
                  <p className="text-emerald-300/70 text-xs leading-relaxed">
                    By saving this recipient, you confirm the details are accurate. You can edit them at any time from
                    your recipients list.
                  </p>
                </div>
              </div>
            )}

            {/* ── Navigation buttons ── */}
            <div className={`flex gap-3 mt-7 ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/55 hover:text-primary hover:bg-inputbg text-sm font-medium transition-all"
                >
                  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 7H3M6 4L3 7l3 3" />
                  </svg>
                  Back
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={advance}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-all shadow-md shadow-accent/30"
                >
                  Continue
                  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h8M8 4l3 3-3 3" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-60 text-primary text-sm font-semibold transition-all shadow-md shadow-accent/30"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>Next</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step label */}
        <p className="text-center text-primary/20 text-xs mt-4">
          Step {step} of {STEPS.length} — {STEPS[step - 1].label}
        </p>
      </div>
    </div>
  );
}
