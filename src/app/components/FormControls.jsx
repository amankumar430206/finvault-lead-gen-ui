import { useId } from "react";

export const FormField = ({ label, error, helperText, children, required }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-white/70">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {children}

      {helperText && !error && <p className="mt-1 text-xs text-white/40">{helperText}</p>}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

// Input.jsx
export const Input = ({ value, onChange, onBlur, placeholder, type = "text", error, disabled, className = "" }) => {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={`
        w-full
        px-4 py-3
        rounded-xl
        border
        text-sm
        transition-all duration-200
        outline-none

        ${
          error
            ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
            : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15] focus:border-emerald-500/40 focus:bg-emerald-500/[0.03]"
        }

        text-white placeholder:text-white/25
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    />
  );
};

export const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  disabled,
  getOptionLabel = (o) => o.label ?? o,
  getOptionValue = (o) => o.value ?? o,
}) => {
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          w-full appearance-none
          px-4 pr-10 py-3
          rounded-xl border text-sm
          transition-all duration-200 outline-none

          ${
            error
              ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
              : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15] focus:border-emerald-500/40 focus:bg-emerald-500/[0.03]"
          }

          text-white
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <option value="" disabled className="bg-[#13161f] text-white/60">
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={getOptionValue(opt)} value={getOptionValue(opt)} className="bg-[#13161f] text-white">
            {getOptionLabel(opt)}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-white/30" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export const Textarea = ({ value, onChange, placeholder, rows = 4, error }) => {
  return (
    <textarea
      rows={rows}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`
        w-full px-4 py-3 rounded-xl border text-sm
        transition-all duration-200 outline-none resize-none

        ${
          error
            ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
            : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15] focus:border-emerald-500/40 focus:bg-emerald-500/[0.03]"
        }

        text-white placeholder:text-white/25
      `}
    />
  );
};

export const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 accent-emerald-500"
      />
      <span className="text-sm text-white/70">{label}</span>
    </label>
  );
};

export const RadioGroup = ({ value, onChange, options = [] }) => {
  return (
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="accent-emerald-500"
          />
          <span className="text-sm text-white/70">{opt}</span>
        </label>
      ))}
    </div>
  );
};
