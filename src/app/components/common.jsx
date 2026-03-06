import Link from "next/link";
import { Icon, ICONS } from "./icons";

// ── Stat Card ──────────────────────────────────────────────
export const StatCard = ({ label, value, change, changeLabel = "vs last month", icon, iconColor = "emerald" }) => {
  const isPositive = change >= 0;
  const colorMap = {
    emerald: "bg-accent/10 text-accent",
    blue: "bg-blue-500/10 text-blue-400",
    violet: "bg-violet-500/10 text-violet-400",
    amber: "bg-amber-500/10 text-amber-400",
    rose: "bg-rose-500/10 text-rose-400",
  };

  return (
    <div className="bg-card border  border-[var(--border-clr)] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-primary/75 text-sm font-medium">{label}</span>
        {icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[iconColor]}`}>
            <Icon path={ICONS[icon]} className="w-4.5 h-4.5" />
          </div>
        )}
      </div>
      <div>
        <p className="text-primary text-2xl font-semibold tracking-tight">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1.5">
            <Icon
              path={isPositive ? ICONS.trending : ICONS.trendingDown}
              className={`w-3.5 h-3.5 ${isPositive ? "text-accent" : "text-red-400"}`}
            />
            <span className={`text-xs font-medium ${isPositive ? "text-accent" : "text-red-400"}`}>
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-primary/50 text-xs">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Transaction Row ─────────────────────────────────────────
export const TransactionRow = ({ name, category, date, amount, status }) => {
  const statusStyle = {
    completed: "bg-accent/10 text-accent",
    pending: "bg-amber-500/10 text-amber-400",
    failed: "bg-red-500/10 text-red-400",
  };
  const isDebit = amount < 0;

  return (
    <div className="flex items-center gap-4 py-3.5 border-b  border-[var(--border-clr)] last:border-0">
      <div className="w-9 h-9 rounded-xl bg-inputbg flex items-center justify-center shrink-0">
        <Icon path={ICONS.arrow} className="w-4 h-4 text-primary/75" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-primary text-sm font-medium truncate">{name}</p>
        <p className="text-primary/40 text-xs">
          {category} · {date}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold text-accent`}>
          {Math.abs(amount).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        {status && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${statusStyle[status]}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Transaction Table ───────────────────────────────────────
export const TransactionTable = ({ transactions = [] }) => (
  <div className="bg-card2 border  border-[var(--border-clr)] rounded-2xl p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-primary font-semibold text-[15px]">Recent Transactions</h3>
      <Link
        href={"/app/transactions"}
        className="text-accent text-xs font-medium hover:text-emerald-300 transition-colors"
      >
        View all →
      </Link>
    </div>
    {transactions.map((tx, i) => (
      <TransactionRow key={i} {...tx} />
    ))}
  </div>
);

// ── Card (Credit/Debit visual) ──────────────────────────────
export const PaymentCard = ({ holder, last4, expiry, balance, variant = "dark" }) => {
  const variants = {
    dark: "from-[#1a1f2e] to-[#0f1117]",
    emerald: "from-emerald-600 to-emerald-900",
    violet: "from-violet-600 to-indigo-900",
  };

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${variants[variant]} p-6 border  border-[var(--border-clr)] overflow-hidden flex flex-col justify-between`}
    >
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-inputbg" />
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-inputbg" />

      <div className="flex items-start justify-between relative mb-5">
        <div>
          <p className="text-primary/40 text-xs">Balance</p>
          <p className="text-primary text-xl font-semibold mt-0.5">
            {balance?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <Icon path={ICONS.creditCard} className="w-6 h-6 text-primary/50" />
      </div>

      <div className="relative">
        <p className="text-primary/60 font-mono text-sm tracking-widest">•••• •••• •••• {last4}</p>
        <div className="flex items-end justify-between mt-2">
          <div>
            <p className="text-primary/50 text-[10px] uppercase tracking-wider">Card Holder</p>
            <p className="text-primary text-xs font-medium">{holder}</p>
          </div>
          <div className="text-right">
            <p className="text-primary/50 text-[10px] uppercase tracking-wider">Expires</p>
            <p className="text-primary text-xs font-medium">{expiry}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Badge ──────────────────────────────────────────────────
export const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-inputbg text-primary/60",
    success: "bg-accent/10 text-accent",
    warning: "bg-amber-500/10 text-amber-400",
    danger: "bg-red-500/10 text-red-400",
    info: "bg-blue-500/10 text-blue-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

// ── Progress Bar ───────────────────────────────────────────
export const ProgressBar = ({ label, value, max, color = "emerald" }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colors = {
    emerald: "bg-accent",
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-primary/60">{label}</span>
        <span className="text-primary/40">{pct}%</span>
      </div>
      <div className="h-1.5 bg-inputbg rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ── Widget / Panel ─────────────────────────────────────────
export const Widget = ({ title, subtitle, children, action }) => (
  <div className="bg-card2 border  border-[var(--border-clr)] rounded-2xl p-5">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-primary font-semibold text-[15px]">{title}</h3>
        {subtitle && <p className="text-primary/40 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button className="text-primary/50 hover:text-primary/60 transition-colors">
          <Icon path={ICONS.chevronDown} className="w-4 h-4" />
        </button>
      )}
    </div>
    {children}
  </div>
);

// ── Alert Banner ───────────────────────────────────────────
export const AlertBanner = ({ type = "info", message }) => {
  const styles = {
    info: { bar: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-300" },
    success: {
      bar: "bg-accent",
      bg: "bg-accent/10",
      text: "text-emerald-300",
    },
    warning: {
      bar: "bg-amber-500",
      bg: "bg-amber-500/10",
      text: "text-amber-300",
    },
    danger: { bar: "bg-red-500", bg: "bg-red-500/10", text: "text-red-300" },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 rounded-xl ${s.bg} p-4 border  border-[var(--border-clr)]`}>
      <div className={`w-1 shrink-0 rounded-full ${s.bar}`} />
      <p className={`text-sm ${s.text}`}>{message}</p>
    </div>
  );
};

// ── MiniChart (sparkline with SVG) ─────────────────────────
export const Sparkline = ({ data = [], color = "#10b981", height = 48 }) => {
  const w = 120,
    h = height;
  const max = Math.max(...data),
    min = Math.min(...data);
  const xs = data.map((_, i) => (i / (data.length - 1)) * w);
  const ys = data.map((v) => h - ((v - min) / (max - min || 1)) * h * 0.85 - h * 0.075);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = `${d} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sg)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
