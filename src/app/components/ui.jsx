"use client";

import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   FINVAULT UI — Component Library
   Dark fintech theme  ·  Tailwind only  ·  No icon deps
═══════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────
// 1. BUTTON
// ─────────────────────────────────────────────────────────────
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  leftIcon,
  rightIcon,
}) => {
  const base =
    "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0d12]";

  const variants = {
    primary:
      "bg-accent hover:bg-accent/80 text-white shadow-md shadow-accent/30 hover:shadow-emerald-500/35 focus:ring-emerald-500",
    secondary:
      "bg-inputbg hover:bg-inputbg text-primary/80 hover:text-primary border  border-[var(--border-clr)] focus:ring-white/20",
    outline:
      "bg-transparent hover:bg-accent/80/10 text-accent border border-accent/50 hover: border-[var(--border-clr)] focus:ring-emerald-500",
    ghost: "bg-transparent hover:bg-inputbg text-primary/60 hover:text-primary focus:ring-white/20",
    danger: "bg-red-500/90 hover:bg-red-500 text-primary shadow-md shadow-red-500/20 focus:ring-red-500",
    success: "bg-emerald-600 hover:bg-accent/80 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500",
  };

  const sizes = {
    xs: "text-xs px-3 py-1.5 gap-1.5",
    sm: "text-sm px-4 py-2 gap-2",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
    xl: "text-base px-8 py-4 gap-3",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// 2. INPUT
// ─────────────────────────────────────────────────────────────
export const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  hint,
  error,
  success,
  disabled,
  prefix,
  suffix,
  size = "md",
}) => {
  const sizes = { sm: "py-2 text-xs", md: "py-2.5 text-sm", lg: "py-3.5 text-base" };
  const state = error
    ? "border-red-500/50 bg-red-500/5 focus-within:border-red-500/70"
    : success
      ? " border-[var(--border-clr)] bg-accent/5 focus-within: border-[var(--border-clr)]"
      : " border-[var(--border-clr)] bg-inputbg focus-within:border-accent/50 focus-within:bg-accent/[0.03]";

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-primary/75 uppercase tracking-wider">{label}</label>}
      <div
        className={`flex items-center rounded-xl border transition-all duration-200 ${state} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {prefix && <span className="pl-3.5 text-primary/50 text-sm shrink-0">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] px-3.5 ${sizes[size]} ${prefix ? "pl-1.5" : ""} ${suffix ? "pr-1.5" : ""}`}
        />
        {suffix && <span className="pr-3.5 text-primary/50 text-sm shrink-0">{suffix}</span>}
      </div>
      {(hint || error || success) && (
        <p className={`text-xs ${error ? "text-red-400" : success ? "text-accent" : "text-primary/50"}`}>
          {error || success || hint}
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. TEXTAREA
// ─────────────────────────────────────────────────────────────
export const Textarea = ({ label, placeholder, value, onChange, rows = 4, hint, error, maxLength }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-medium text-primary/75 uppercase tracking-wider">{label}</label>}
    <div
      className={`rounded-xl border transition-all duration-200 ${error ? "border-red-500/50 bg-red-500/5" : " border-[var(--border-clr)] bg-inputbg focus-within:border-accent/50"}`}
    >
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-transparent outline-none text-primary placeholder:text-[var(--text-muted)] text-sm px-3.5 py-3 resize-none"
      />
      {maxLength && (
        <div className="px-3.5 pb-2 text-right">
          <span className="text-xs text-primary/20">
            {(value || "").length}/{maxLength}
          </span>
        </div>
      )}
    </div>
    {(hint || error) && <p className={`text-xs ${error ? "text-red-400" : "text-primary/50"}`}>{error || hint}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 4. SELECT
// ─────────────────────────────────────────────────────────────
export const Select = ({ label, options = [], value, onChange, placeholder = "Select an option", hint, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && <label className="text-xs font-medium text-primary/75 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 text-left
            ${error ? "border-red-500/50 bg-red-500/5" : open ? "border-accent/50 bg-accent/[0.03]" : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)]"}
            ${selected ? "text-primary" : "text-primary/70"}`}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <span className={`text-primary/50 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        {open && (
          <div className="absolute z-50 mt-1.5 w-full rounded-xl border  border-[var(--border-clr)] bg-card2 shadow-md overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors flex items-center justify-between
                  ${opt.value === value ? "text-accent bg-accent/10" : "text-primary/70 hover:text-primary hover:bg-inputbg"}
                  ${opt.disabled ? "opacity-40 pointer-events-none" : ""}`}
              >
                <span>{opt.label}</span>
                {opt.value === value && <span className="text-accent text-xs">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      {(hint || error) && <p className={`text-xs ${error ? "text-red-400" : "text-primary/50"}`}>{error || hint}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 5. RADIO GROUP
// ─────────────────────────────────────────────────────────────
export const RadioGroup = ({ label, options = [], value, onChange, orientation = "vertical" }) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-xs font-medium text-primary/75 uppercase tracking-wider">{label}</label>}
    <div className={`flex gap-3 ${orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"}`}>
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => !opt.disabled && onChange(opt.value)}
            disabled={opt.disabled}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200
              ${checked ? " border-[var(--border-clr)] bg-accent/[0.07]" : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)] hover:bg-inputbg"}
              ${opt.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div
              className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
              ${checked ? "border-emerald-500" : "border-white/20"}`}
            >
              {checked && <div className="w-2 h-2 rounded-full bg-accent" />}
            </div>
            <div>
              <p className={`text-sm font-medium ${checked ? "text-primary" : "text-primary/60"}`}>{opt.label}</p>
              {opt.description && <p className="text-xs text-primary/50 mt-0.5">{opt.description}</p>}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// 6. CHECKBOX
// ─────────────────────────────────────────────────────────────
export const Checkbox = ({ label, description, checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`flex items-start gap-3 text-left group ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <div
      className={`mt-0.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200
        ${checked ? "bg-accent border-emerald-500" : "border-white/20 bg-inputbg group-hover:border-white/30"}`}
      style={{ width: "18px", height: "18px", minWidth: "18px" }}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <div>
      <p
        className={`text-sm font-medium transition-colors ${checked ? "text-primary" : "text-primary/60 group-hover:text-primary/80"}`}
      >
        {label}
      </p>
      {description && <p className="text-xs text-primary/50 mt-0.5">{description}</p>}
    </div>
  </button>
);

// ─────────────────────────────────────────────────────────────
// 7. TOGGLE / SWITCH
// ─────────────────────────────────────────────────────────────
export const Toggle = ({ label, description, checked, onChange, disabled }) => (
  <div className={`flex items-center justify-between gap-4 ${disabled ? "opacity-40" : ""}`}>
    {(label || description) && (
      <div>
        {label && <p className="text-sm font-medium text-primary/80">{label}</p>}
        {description && <p className="text-xs text-primary/50 mt-0.5">{description}</p>}
      </div>
    )}
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-[#0b0d12]
        ${checked ? "bg-accent shadow-md shadow-emerald-500/30" : "bg-inputbg"}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────
// 8. BADGE
// ─────────────────────────────────────────────────────────────
export const Badge = ({ children, variant = "default", size = "md", dot = false }) => {
  const variants = {
    default: "bg-inputbg text-primary/60",
    success: "bg-accent/10 text-accent border  border-[var(--border-clr)]",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  };
  const dotColors = {
    default: "bg-white/40",
    success: "bg-accent",
    warning: "bg-amber-400",
    danger: "bg-red-400",
    info: "bg-blue-400",
    violet: "bg-violet-400",
  };
  const sizes = { sm: "text-[10px] px-1.5 py-0.5", md: "text-xs px-2 py-0.5", lg: "text-sm px-3 py-1" };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// 9. MODAL
// ─────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, description, children, footer, size = "md" }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${sizes[size]} rounded-2xl bg-card border  border-[var(--border-clr)] shadow-md flex flex-col max-h-[90vh]`}
        style={{ animation: "modalIn 0.2s ease" }}
      >
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
        <div className="h-px w-full bg-gradient-to-r from-bg-card via-accent/80 from-bg-card rounded-t-2xl" />
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            {title && <h2 className="text-primary font-semibold text-base">{title}</h2>}
            {description && <p className="text-primary/40 text-sm mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-primary/50 hover:text-primary/70 hover:bg-inputbg rounded-lg p-1.5 transition-all -mt-1 -mr-1"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
        <div className="px-6 pb-2 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t  border-[var(--border-clr)] bg-inputbg rounded-b-2xl flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 10. ALERT BANNER
// ─────────────────────────────────────────────────────────────
export const Alert = ({ type = "info", title, message, onClose }) => {
  const styles = {
    info: { bar: "bg-blue-500", bg: "bg-blue-500/8", text: "text-blue-300", icon: "ℹ" },
    success: { bar: "bg-accent", bg: "bg-accent/8", text: "text-emerald-300", icon: "✓" },
    warning: { bar: "bg-amber-500", bg: "bg-amber-500/8", text: "text-amber-300", icon: "⚠" },
    danger: { bar: "bg-red-500", bg: "bg-red-500/8", text: "text-red-300", icon: "✕" },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 rounded-xl ${s.bg} p-4 border  border-[var(--border-clr)]`}>
      <div className={`w-1 shrink-0 rounded-full ${s.bar}`} />
      <div
        className={`w-5 h-5 rounded-full ${s.bar} flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5`}
      >
        {s.icon}
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className={`text-sm font-semibold ${s.text}`}>{title}</p>}
        {message && <p className={`text-xs mt-0.5 ${s.text} opacity-80`}>{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-primary/70 hover:text-primary/60 shrink-0 transition-colors text-sm">
          ✕
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 11. TOOLTIP
// ─────────────────────────────────────────────────────────────
export const Tooltip = ({ children, text, position = "top" }) => {
  const [show, setShow] = useState(false);
  const pos = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full  left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full  top-1/2 -translate-y-1/2 ml-2",
  };
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute z-50 ${pos[position]} pointer-events-none`}>
          <div className="bg-[#1e2330] border  border-[var(--border-clr)] text-primary/90 text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 12. TABS
// ─────────────────────────────────────────────────────────────
export const Tabs = ({ tabs = [], activeTab, onChange, variant = "underline" }) => {
  if (variant === "pill") {
    return (
      <div className="flex gap-1 bg-inputbg rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === t.id ? "bg-accent text-primary shadow-md shadow-accent/30" : "text-primary/75 hover:text-primary/80"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-0 border-b  border-[var(--border-clr)]">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`relative px-5 py-3 text-sm font-medium transition-all duration-200
            ${activeTab === t.id ? "text-primary" : "text-primary/40 hover:text-primary/70"}`}
        >
          {t.label}
          {t.badge && (
            <span className="ml-2 text-[10px] bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">{t.badge}</span>
          )}
          {activeTab === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full" />}
        </button>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 13. TABLE
// ─────────────────────────────────────────────────────────────
export const Table = ({ columns = [], rows = [], onRowClick }) => (
  <div className="rounded-2xl border  border-[var(--border-clr)] overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-inputbg border-b  border-[var(--border-clr)]">
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-5 py-3.5 text-left text-xs font-semibold text-primary/50 uppercase tracking-wider ${col.align === "right" ? "text-right" : ""}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            onClick={() => onRowClick?.(row)}
            className={`border-b  border-[var(--border-clr)] last:border-0 transition-colors ${onRowClick ? "cursor-pointer hover:bg-inputbg" : ""}`}
          >
            {columns.map((col) => (
              <td key={col.key} className={`px-5 py-3.5 text-primary/70 ${col.align === "right" ? "text-right" : ""}`}>
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─────────────────────────────────────────────────────────────
// 14. AVATAR + AVATAR GROUP
// ─────────────────────────────────────────────────────────────
export const Avatar = ({ name, src, size = "md", status }) => {
  const sizes = {
    xs: "w-6 h-6 text-[9px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };
  const statusDot = { online: "bg-accent", offline: "bg-white/20", busy: "bg-amber-400", away: "bg-orange-400" };
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white/[0.06]`} />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center font-bold text-primary ring-2 ring-white/[0.06]`}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0b0d12] ${statusDot[status]}`}
        />
      )}
    </div>
  );
};

export const AvatarGroup = ({ names = [], max = 4 }) => {
  const visible = names.slice(0, max);
  const overflow = names.length - max;
  return (
    <div className="flex -space-x-2.5">
      {visible.map((n, i) => (
        <div key={i} className="ring-2 ring-[#0b0d12] rounded-full">
          <Avatar name={n} size="sm" />
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-8 h-8 rounded-full bg-inputbg border-2 border-[#0b0d12] flex items-center justify-center text-[10px] font-semibold text-primary/60">
          +{overflow}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 15. PROGRESS BAR
// ─────────────────────────────────────────────────────────────
export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = "md",
  color = "emerald",
  animated = false,
}) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const heights = { xs: "h-1", sm: "h-1.5", md: "h-2", lg: "h-3" };
  const colors = {
    emerald: "bg-accent",
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    cyan: "bg-cyan-500",
  };
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-primary/75">{label}</span>}
          {showValue && <span className="text-xs text-primary/50 font-mono">{pct}%</span>}
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-inputbg rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colors[color]} rounded-full transition-all duration-700 ease-out ${animated ? "animate-pulse" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 16. SLIDER
// ─────────────────────────────────────────────────────────────
export const Slider = ({ label, value, onChange, min = 0, max = 100, step = 1, prefix = "", suffix = "" }) => (
  <div>
    {label && (
      <div className="flex justify-between mb-2">
        <label className="text-xs font-medium text-primary/75 uppercase tracking-wider">{label}</label>
        <span className="text-xs font-medium text-accent font-mono">
          {prefix}
          {value}
          {suffix}
        </span>
      </div>
    )}
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 appearance-none cursor-pointer rounded-full outline-none"
      style={{
        background: `linear-gradient(to right, #10b981 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.07) ${((value - min) / (max - min)) * 100}%)`,
      }}
    />
    <style>{`input[type=range]::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:#10b981;cursor:pointer;border:2px solid #0b0d12;box-shadow:0 0 8px rgba(16,185,129,0.5);}input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#10b981;cursor:pointer;border:2px solid #0b0d12;}`}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────
// 17. CARD
// ─────────────────────────────────────────────────────────────
export const Card = ({ children, title, subtitle, footer, padding = "md", hover = false, accent = false }) => {
  const paddings = { none: "", sm: "p-4", md: "p-5", lg: "p-7" };
  return (
    <div
      className={`bg-card2 border  border-[var(--border-clr)] rounded-2xl overflow-hidden transition-all duration-200 ${hover ? "hover: border-[var(--border-clr)] hover:bg-[#14182a]" : ""}`}
      style={accent ? { borderTopColor: "rgba(16,185,129,0.4)", borderTopWidth: "2px" } : {}}
    >
      {accent && <div className="h-px w-full bg-gradient-to-r from-bg-card via-accent/80 from-bg-card" />}
      {(title || subtitle) && (
        <div className={`${paddings[padding]} pb-0`}>
          {title && <h3 className="text-primary font-semibold text-[15px]">{title}</h3>}
          {subtitle && <p className="text-primary/40 text-xs mt-0.5">{subtitle}</p>}
          <div className="mt-4 h-px bg-inputbg" />
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
      {footer && <div className="border-t  border-[var(--border-clr)] bg-inputbg px-5 py-3.5">{footer}</div>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 18. DROPDOWN MENU
// ─────────────────────────────────────────────────────────────
export const DropdownMenu = ({ trigger, items = [] }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative inline-flex" ref={ref}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl border  border-[var(--border-clr)] bg-card2 shadow-md z-50 overflow-hidden py-1"
          style={{ animation: "modalIn 0.15s ease" }}
        >
          {items.map((item, i) => {
            if (item.divider) return <div key={i} className="my-1 h-px bg-inputbg" />;
            return (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors
                  ${item.danger ? "text-red-400 hover:bg-red-500/[0.08]" : "text-primary/60 hover:text-primary hover:bg-inputbg"}
                  ${item.disabled ? "opacity-40 pointer-events-none" : ""}`}
              >
                {item.icon && <span className="text-xs w-4 text-center">{item.icon}</span>}
                {item.label}
                {item.shortcut && <span className="ml-auto text-xs text-primary/20 font-mono">{item.shortcut}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 19. SEARCH INPUT
// ─────────────────────────────────────────────────────────────
export const SearchInput = ({ value, onChange, placeholder = "Search…", onClear }) => (
  <div className="flex items-center gap-2.5 bg-inputbg border  border-[var(--border-clr)] rounded-xl px-3.5 py-2.5 focus-within:border-accent/50 transition-all duration-200">
    <span className="text-primary/50 text-sm shrink-0">⌕</span>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-1 bg-transparent outline-none text-sm text-primary placeholder:text-primary/70"
    />
    {value && onClear && (
      <button onClick={onClear} className="text-primary/70 hover:text-primary/60 transition-colors text-xs">
        ✕
      </button>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 20. STAT CARD
// ─────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, change, icon, color = "emerald" }) => {
  const colors = {
    emerald: "bg-accent/10 text-accent",
    blue: "bg-blue-500/10 text-blue-400",
    violet: "bg-violet-500/10 text-violet-400",
    amber: "bg-amber-500/10 text-amber-400",
  };
  const pos = change >= 0;
  return (
    <div className="bg-card2 border  border-[var(--border-clr)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-primary/45 text-sm">{label}</span>
        {icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${colors[color]}`}>{icon}</div>
        )}
      </div>
      <p className="text-primary text-2xl font-semibold tracking-tight">{value}</p>
      {change !== undefined && (
        <p className={`text-xs mt-1.5 font-medium ${pos ? "text-accent" : "text-red-400"}`}>
          {pos ? "↑" : "↓"} {Math.abs(change)}% vs last month
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 21. EMPTY STATE
// ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = "◎", title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
    <div className="w-14 h-14 rounded-2xl bg-inputbg border  border-[var(--border-clr)] flex items-center justify-center text-2xl text-primary/20">
      {icon}
    </div>
    <div>
      <p className="text-primary/60 font-medium text-sm">{title}</p>
      {description && <p className="text-primary/50 text-xs mt-1 max-w-xs">{description}</p>}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 22. SKELETON LOADER
// ─────────────────────────────────────────────────────────────
export const Skeleton = ({ width, height = "h-4", rounded = "rounded-lg" }) => (
  <div className={`${height} ${rounded} bg-inputbg overflow-hidden relative`} style={{ width: width || "100%" }}>
    <div
      className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]"
      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }}
    />
    <style>{`@keyframes shimmer { to { transform: translateX(200%); } }`}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────
// 23. DIVIDER
// ─────────────────────────────────────────────────────────────
export const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-inputbg" />
    {label && <span className="text-primary/70 text-xs shrink-0">{label}</span>}
    <div className="flex-1 h-px bg-inputbg" />
  </div>
);

export const DividerGr = () => (
  <div className="fade-up delay-4 h-px bg-gradient-to-r from-bg-card via-white/[0.07] from-bg-card" />
);

// ─────────────────────────────────────────────────────────────
// 24. CHIP / TAG
// ─────────────────────────────────────────────────────────────
export const Chip = ({ label, onRemove, color = "default" }) => {
  const colors = {
    default: "bg-inputbg text-primary/60  border-[var(--border-clr)]",
    emerald: "bg-accent/10 text-accent  border-[var(--border-clr)]",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${colors[color]}`}
    >
      {label}
      {onRemove && (
        <button onClick={onRemove} className="opacity-60 hover:opacity-100 transition-opacity leading-none">
          ✕
        </button>
      )}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// Section label helper (internal)
// ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <p className="text-primary/70 font-semibold text-sm tracking-tight">{children}</p>
    <div className="flex-1 h-px bg-inputbg" />
  </div>
);
