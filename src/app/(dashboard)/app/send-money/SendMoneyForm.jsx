"use client";
import { useEffect, useId } from "react";
import { Divider, DividerGr } from "@/app/components/ui";
import { useCancelTransaction, useCreateTransaction } from "@/hooks/useTransactions";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth.store";
import { CURRENCIES } from "@/lib/currencies";
import { useSendMoneyForm } from "@/store/form.store";
import { useRouter } from "next/navigation";
import SelectRemitter from "./SelectRemitter";
import { Icon, ICONS } from "@/app/components/icons";

// ── Static data ───────────────────────────────────────────

const PURPOSE_CODES = [
  "Overseas Education – University Fees",
  "Overseas Education – Living Expenses",
  "Family Maintenance",
  "Medical Treatment Abroad",
  "Travel & Tourism",
  "Gift / Donation",
  "Business Services",
  "Import of Goods",
];

const FEE_STRUCTURE = [
  { label: "Forex Rate", value: "₹ 83.25", bold: false },
  { label: "Bank Fees", value: "₹ 1,500.00", bold: false },
  { label: "Platform Fees", value: "₹ 1,250.00", bold: false },
  { label: "FCCT", value: "₹ 999.83", bold: false },
];
const TOTAL = "₹ 1,03,733.08";

// ── Sub-components ────────────────────────────────────────

const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-primary/75 uppercase tracking-wider mb-1.5">
    {children}
    {required && <span className="text-accent ml-0.5">*</span>}
  </label>
);

const FieldError = ({ message }) =>
  message ? (
    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
      <span>⚠</span>
      {message}
    </p>
  ) : null;

const CurrencySelect = ({ value, onChange, options }) => {
  const id = useId();

  return (
    <div className="relative h-full">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none
          h-full
          px-3 pr-7
          text-sm font-semibold
          bg-transparent
          text-primary
          hover:text-accent
          focus:text-accent
          outline-none
          cursor-pointer
          transition-colors
        "
      >
        {options.map((c) => (
          <option key={c} value={c} className="bg-card2 text-primary">
            {c}
          </option>
        ))}
      </select>

      {/* Custom Arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg className="w-3 h-3 text-primary/50" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

const PurposeSelect = ({ value, onChange, onBlur, error }) => {
  const id = useId();

  return (
    <div className="relative">
      <select
        id={id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`
          w-full
          appearance-none
          px-4 pr-10 py-3
          rounded-xl
          border
          text-sm
          transition-all duration-200
          outline-none
          cursor-pointer

          ${
            error
              ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
              : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)] focus:border-accent/50 focus:bg-accent/[0.03]"
          }

          ${value ? "text-primary" : "text-primary/70"}
        `}
      >
        <option value="" disabled className="bg-card2 text-primary/60">
          Select a purpose code
        </option>

        {PURPOSE_CODES.map((p) => (
          <option key={p} value={p} className="bg-card2 text-primary">
            {p}
          </option>
        ))}
      </select>

      {/* Custom arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-primary/50" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

// ── Main Form ─────────────────────────────────────────────
export function SendMoneyForm() {
  const router = useRouter();
  const [currency, setCurrency] = useState("USD");

  const { transaction, setFormData, remitter, user } = useSendMoneyForm((s) => s);
  const { isPending, isSuccess, mutateAsync } = useCreateTransaction();
  const { isPending: isCancelPending, data: cancelData, mutateAsync: cancelMutateAsync } = useCancelTransaction();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      purposeCode: "",
    },
  });

  const amountValue = watch("amount");
  const currencyValue = CURRENCIES.find((c) => c.code === currency).forexRate;
  const convertedAmount = amountValue ? parseFloat(amountValue) * currencyValue : 0;

  const feeStructure = {
    amount: convertedAmount,
    fxRate: currencyValue,
    bankFee: 1500,
    platformFee: 1250,
    fcct: 999.83,
  };

  const totalPayable = convertedAmount + feeStructure.bankFee + feeStructure.platformFee + feeStructure.fcct; // amount + bank fee + platform fee + fcct

  const displayFeeStructure = [
    { label: "Forex Rate", value: `₹ ${feeStructure.fxRate.toFixed(2)}` },
    { label: "Bank Fees", value: `₹ ${feeStructure.bankFee.toFixed(2)}` },
    { label: "Platform Fees", value: `₹ ${feeStructure.platformFee.toFixed(2)}` },
    { label: "FCCT", value: `₹ ${feeStructure.fcct.toFixed(2)}` },
    { label: "Amount", value: `₹ ${convertedAmount.toFixed(2)}` },
  ];
  const displayTotal = totalPayable.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        amount: parseFloat(amountValue).toFixed(2),
        currency,
        purposeCode: data.purposeCode,
        user: user?._id,
        onBehalfOf: user?._id,
        transactionBy: user?._id,
        feeConfig: { ...feeStructure, amount: convertedAmount.toFixed(2), totalPayable: totalPayable.toFixed(2) },
        metadata: data.metadata,
      };
      setFormData(data);
      await mutateAsync(payload);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const cancelTransaction = async () => {
    if (!transaction?._id) return;
    await cancelMutateAsync(transaction?._id);
    window.location.reload();
  };

  if (!remitter) {
    return (
      <div className="my-8 bg-base flex items-center justify-center">
        <div className="w-full rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-md max-w-6xl">
          {/* Header */}
          <div className="p-5 border-b  border-[var(--border-clr)] fade-up">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent border  border-[var(--border-clr)] flex items-center justify-center">
                <Icon path={ICONS.users} />
              </div>
              <div>
                <h1 className="text-primary font-semibold text-xl leading-tight">Remitter</h1>
                <p className="text-primary/50 text-xs mt-0.5">Make Transfer · Powered by Myntpe</p>
              </div>
            </div>
          </div>

          {/* choose Remitter */}
          <SelectRemitter />
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div className="w-full rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-md max-w-[600px]">
          <div className="h-px w-full bg-gradient-to-r from-bg-card via-accent/50 from-bg-card" />
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-emerald-500/30 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-primary text-xl font-semibold">Transfer Initiated</h2>
              <p className="text-primary/40 text-sm mt-1.5">
                Your transfer request has been received and is being processed.
              </p>
            </div>
            <div className="w-full bg-inputbg rounded-xl border  border-[var(--border-clr)] divide-y divide-white/[0.05]">
              {[
                ["Amount", `${currency} ${amountValue || "0.00"}`],
                ["(Converted)", displayTotal],
                ["Purpose", "Overseas Education"],
                // ["Est. Delivery", "1–2 business days"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-3">
                  <span className="text-primary/40 text-sm">{k}</span>
                  <span className="text-primary text-sm font-medium mono">{v}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                router.replace("/app/send-money/remitter");
              }}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent/80 text-white font-semibold text-sm transition-all shadow-md shadow-accent/30 flex items-center justify-center gap-2"
            >
              Proceed & Review Remmiter{" "}
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
            <Divider />
            <div>
              <button
                disabled={isCancelPending || !transaction?._id}
                onClick={() => {
                  cancelTransaction(transaction._id);
                }}
                className="w-full py-3 rounded-xl hover:bg-red-400/10 text-red-500 font-semibold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel Transaction {isCancelPending && <span className="animate-spin w-4 h-4">(Cancelling…)</span>}
              </button>

              <p className="text-primary/40 text-xs">Please note once cancelled form cannot be recovered.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-[600px]">
        {/* Card */}
        <div className="relative rounded-2xl bg-card border  border-[var(--border-clr)] shadow-md overflow-hidden">
          {/* Top accent */}
          <div className="h-px w-full bg-gradient-to-r from-bg-card via-accent/50 from-bg-card" />

          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b  border-[var(--border-clr)] fade-up">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border  border-[var(--border-clr)] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4.5 h-4.5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-primary font-semibold text-xl leading-tight">How much do you want to send?</h1>
                <p className="text-primary/50 text-xs mt-0.5">Make Transfer · Powered by Myntpe</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-7 py-6 flex flex-col gap-5">
            {/* Amount + Currency */}
            <div className="fade-up delay-1">
              <FieldLabel required>Amount to send</FieldLabel>
              <div
                className={`flex items-stretch rounded-xl border overflow-hidden transition-all duration-200
                ${errors.amount ? "border-red-500/50 bg-red-500/5" : " border-[var(--border-clr)] bg-inputbg focus-within:border-accent/50 focus-within:bg-accent/[0.02]"}`}
              >
                {/* Currency selector */}
                <div className="flex items-center border-r  border-[var(--border-clr)] px-1 bg-inputbg">
                  <CurrencySelect value={currency} onChange={setCurrency} options={CURRENCIES?.map((c) => c.code)} />
                </div>
                {/* Amount input */}
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1, message: "Minimum amount is 1" },
                    max: { value: 1000000, message: "Maximum amount is 1,000,000" },
                  })}
                  className="flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm py-3 px-4 mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {/* Convert pill */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-4 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/20 border-l  border-[var(--border-clr)] transition-colors whitespace-nowrap"
                >
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 5h10M9 2l3 3-3 3M14 11H4m3 3l-3-3 3-3" />
                  </svg>
                  Convert
                </button>
              </div>
              <FieldError message={errors.amount?.message} />
            </div>

            {/* Forex result */}
            <div className="fade-up delay-2">
              <FieldLabel>Forex conversion</FieldLabel>
              <div className="flex items-stretch rounded-xl border  border-[var(--border-clr)] bg-inputbg overflow-hidden">
                {/* INR tag */}
                <div className="flex items-center justify-center px-4 bg-inputbg border-r  border-[var(--border-clr)] min-w-[72px]">
                  <span className="text-primary/70 font-semibold text-sm">INR</span>
                </div>
                {/* Converted value */}
                <div className="flex items-center flex-1 px-4 py-3">
                  <span
                    className={`mono text-sm font-medium transition-all ${amountValue ? "text-accent" : "text-primary/20"}`}
                  >
                    {amountValue
                      ? (parseFloat(amountValue) * currencyValue).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "—"}
                  </span>
                </div>
                {/* Rate badge */}
                <div className="flex items-center pr-4">
                  <span className="text-[10px] font-medium text-primary/70 bg-inputbg border  border-[var(--border-clr)] rounded-full px-2 py-0.5 mono whitespace-nowrap">
                    1 {currency} =
                    <span className="text-emerald-500">
                      {" "}
                      {currencyValue.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      INR
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Purpose Code */}
            <div className="fade-up delay-3">
              <FieldLabel required>Purpose Code</FieldLabel>
              <Controller
                name="purposeCode"
                control={control}
                rules={{ required: "Please select a purpose code" }}
                render={({ field }) => (
                  <PurposeSelect
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.purposeCode}
                  />
                )}
              />
              <FieldError message={errors.purposeCode?.message} />
            </div>

            {/* Divider */}
            <DividerGr />

            {/* Fee Structure */}
            <div className="fade-up delay-5">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 1v14M5 4h4.5a2.5 2.5 0 010 5H5m0 0h4.5a2.5 2.5 0 010 5H5"
                  />
                </svg>
                <span className="text-accent font-semibold text-sm">Fee Structure</span>
              </div>

              <div className="rounded-xl border  border-[var(--border-clr)] bg-inputbg overflow-hidden">
                {displayFeeStructure.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 border-b  border-[var(--border-clr)] last:border-0 group hover:bg-inputbg transition-colors"
                  >
                    <span className="text-primary/75 text-sm">{item.label}</span>
                    <span className="text-primary/80 text-sm mono font-medium">{item.value}</span>
                  </div>
                ))}

                {/* Total row */}
                <div className="flex items-center justify-between px-4 py-4 bg-accent/[0.07] border-t  border-[var(--border-clr)]">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold text-sm">Total Payable</span>
                    <span className="text-[10px] text-accent/60 bg-accent/10 border border-emerald-500/15 rounded-full px-1.5 py-0.5 font-medium">
                      incl. all charges
                    </span>
                  </div>
                  <span className="text-accent font-bold text-base mono">{displayTotal}</span>
                </div>
              </div>

              <p className="text-primary/70 text-[11px] mt-2 flex items-center gap-1.5">
                <svg
                  viewBox="0 0 12 12"
                  className="w-3 h-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="6" cy="6" r="5" />
                  <path strokeLinecap="round" d="M6 5.5v3M6 4h.01" />
                </svg>
                TCS will be calculated and added at the final payment step
              </p>
            </div>

            {/* Submit */}
            <div className="fade-up delay-6 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="w-full relative overflow-hidden py-3.5 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-md shadow-accent/20 hover:shadow-accent/20 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    Initiate & Continue
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-primary/20 text-xs mt-3 flex items-center justify-center gap-1.5">
                <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="5" width="8" height="6" rx="1" />
                  <path strokeLinecap="round" d="M4 5V3.5a2 2 0 014 0V5" />
                </svg>
                256-bit SSL encrypted · RBI compliant
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendMoneyForm;
