"use client";

import { CURRENCIES } from "@/lib/currencies";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const STATUSES = ["All", "completed", "pending", "failed"];
const TYPES = ["All", "pending", "completed", "failed"];
const PAGE_SIZES = [8, 15, 25];

// ── Helpers ───────────────────────────────────────────────
const fmtAmount = (n, cur = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: ["USD", "EUR", "GBP", "AED", "SGD", "INR"].includes(cur) ? cur : "USD",
    minimumFractionDigits: 2,
  }).format(n);

const fmtTimeStampDate = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  });
};

const statusStyle = {
  completed: { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  pending: { bg: "bg-amber-500/10  text-amber-400  border-amber-500/20", dot: "bg-amber-400" },
  failed: { bg: "bg-red-500/10    text-red-400    border-red-500/20", dot: "bg-red-400" },
};

const categoryIcon = {
  Revenue: { bg: "bg-emerald-500/10", icon: "💰" },
  Cloud: { bg: "bg-blue-500/10", icon: "☁️" },
  HR: { bg: "bg-violet-500/10", icon: "👥" },
  Refund: { bg: "bg-cyan-500/10", icon: "↩" },
  Transfer: { bg: "bg-orange-500/10", icon: "↗" },
  Marketing: { bg: "bg-pink-500/10", icon: "📣" },
  SaaS: { bg: "bg-indigo-500/10", icon: "⚡" },
  Services: { bg: "bg-teal-500/10", icon: "🔧" },
  Operations: { bg: "bg-yellow-500/10", icon: "🏢" },
  Tax: { bg: "bg-red-500/10", icon: "📋" },
  Funding: { bg: "bg-emerald-500/10", icon: "🚀" },
};

// ── Sub-components ────────────────────────────────────────
const FilterPill = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 border
      ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
          : "bg-white/[0.04] text-white/45 border-white/[0.06] hover:text-white/70 hover:bg-white/[0.07]"
      }`}
  >
    {label}
    {count != null && (
      <span
        className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${active ? "bg-emerald-500/20" : "bg-white/[0.08]"}`}
      >
        {count}
      </span>
    )}
  </button>
);

const SortIcon = ({ dir }) => (
  <svg viewBox="0 0 10 14" className="w-2.5 h-3 ml-1 opacity-50" fill="currentColor">
    <path
      d={dir === "asc" ? "M5 0L9 5H1L5 0Z" : dir === "desc" ? "M5 14L1 9H9L5 14Z" : "M5 0L9 5H1L5 0ZM5 14L1 9H9L5 14Z"}
    />
  </svg>
);

const Pagination = ({ page, totalPages, onPage, pageSize, onPageSize, total, from, to }) => {
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (page >= totalPages - 3)
      return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-white/[0.05]">
      {/* Info + page size */}
      <div className="flex items-center gap-4">
        <span className="text-white/30 text-xs font-mono">
          Showing{" "}
          <span className="text-white/60">
            {from}–{to}
          </span>{" "}
          of <span className="text-white/60">{total}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-white/25 text-xs">Rows:</span>
          <div className="flex gap-1">
            {PAGE_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => onPageSize(s)}
                className={`w-7 h-6 rounded text-xs font-medium transition-all ${pageSize === s ? "bg-emerald-500/15 text-emerald-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.05]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-white/20 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all
                ${p === page ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white hover:bg-white/[0.06]"}`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
        >
          ›
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────
export default function TransactionsTable({ data = [] }) {
  const [search, setSearch] = useState("");
  const [currencyFilter, setCategory] = useState("All");
  const [statusFilter, setStatus] = useState("All");
  const [typeFilter, setType] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selected, setSelected] = useState(new Set());
  const [detailRow, setDetailRow] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const detailRef = useRef(null);

  // Close detail on outside click
  useEffect(() => {
    const h = (e) => {
      if (detailRef.current && !detailRef.current.contains(e.target)) setDetailRow(null);
    };
    if (detailRow) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [detailRow]);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let d = [...(data?.content || [])];
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(q) ||
          t.referenceId.toLowerCase().includes(q) ||
          t.vendor.toLowerCase().includes(q),
      );
    }
    if (currencyFilter !== "All") d = d.filter((t) => t.currency === currencyFilter);
    if (statusFilter !== "All") d = d.filter((t) => t.status === statusFilter);
    if (typeFilter !== "All") d = d.filter((t) => t.status === typeFilter);

    d.sort((a, b) => {
      let va = a[sortKey],
        vb = b[sortKey];
      if (sortKey === "amount") {
        va = a.amount;
        vb = b.amount;
      }
      if (sortKey === "date") {
        va = a.id;
        vb = b.id;
      } // IDs are sequential
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
    return d;
  }, [search, currencyFilter, statusFilter, typeFilter, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length ? (safePage - 1) * pageSize + 1 : 0;
  const to = Math.min(safePage * pageSize, filtered.length);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const toggleSelect = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () =>
    setSelected((s) => (s.size === paginated.length ? new Set() : new Set(paginated.map((t) => t._id))));

  const allSelected = paginated.length > 0 && selected.size === paginated.length;

  const colHeaders = [
    { key: "status", label: "Status" },
    { key: "name", label: "Transaction" },
    { key: "createdAt", label: "Created At" },
    { key: "Remitter", label: "Remitter" },
    { key: "vendor", label: "Vendor" },
    { key: "amount", label: "Amount", right: true },
  ];

  return (
    <>
      <div className="w-full">
        {/* ── Page header ── */}
        <div className="fade-up mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-white text-xl font-semibold tracking-tight">Transactions</h1>
              <p className="text-white/35 text-sm mt-0.5">{filtered.length} records · last updated just now</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.08] text-sm font-medium transition-all">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h10M5 8h6M7 13h2" />
                </svg>
                Export
              </button>
              <Link
                href={"/app/send-money"}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v12M2 8h12" />
                </svg>
                New Transfer
              </Link>
            </div>
          </div>

          {/* Summary stat strip */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Transactions", value: ALL_TRANSACTIONS.length, suffix: "records", color: "text-white" },
              { label: "Total Inflow", value: fmtAmount(totalCredit), color: "text-emerald-400" },
              { label: "Total Outflow", value: fmtAmount(totalDebit), color: "text-red-400" },
              {
                label: "Net Balance",
                value: fmtAmount(totalCredit - totalDebit),
                color: totalCredit - totalDebit >= 0 ? "text-emerald-400" : "text-red-400",
              },
            ].map((s) => (
              <div key={s.label} className="bg-[#13161f] border border-white/[0.06] rounded-xl px-4 py-3">
                <p className="text-white/35 text-[11px] uppercase tracking-wider font-medium mb-1">{s.label}</p>
                <p className={`${s.color} font-semibold text-base mono leading-tight`}>{s.value}</p>
              </div>
            ))}
          </div> */}
        </div>

        {/* ── Main panel ── */}
        <div className="fade-up bg-[#0f1117] rounded-2xl border border-white/[0.07] overflow-hidden shadow-2xl">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          {/* ── Toolbar ── */}
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3.5 py-2.5 focus-within:border-emerald-500/40 transition-all">
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5 text-white/30 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="7" cy="7" r="5" />
                  <path strokeLinecap="round" d="M11 11l3 3" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by Transaction ID or Reference ID"
                  className="bg-transparent flex-1 outline-none text-sm text-white placeholder:text-white/25"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-white/25 hover:text-white/60 transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Type filter pills */}
              <div className="flex items-center gap-1.5 shrink-0">
                {TYPES.map((t) => (
                  <FilterPill
                    key={t}
                    label={
                      t === "All" ? "All" : t === "pending" ? "Pending" : t === "completed" ? "Completed" : "Failed"
                    }
                    active={typeFilter === t}
                    onClick={() => {
                      setType(t);
                      setPage(1);
                    }}
                  />
                ))}
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all shrink-0
                  ${filtersOpen ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-white/[0.04] border-white/[0.07] text-white/45 hover:text-white/70"}`}
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" d="M2 4h12M5 8h6M7 12h2" />
                </svg>
                Filters
                {(currencyFilter !== "All" || statusFilter !== "All") && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {(currencyFilter !== "All" ? 1 : 0) + (statusFilter !== "All" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded filters */}
            {filtersOpen && (
              <div className="mt-3 pt-3 border-t border-white/[0.05] flex flex-col gap-3">
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-widest mb-2">Currency</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", ...CURRENCIES?.map((c) => c.code)].map((c) => {
                      const cnt = c === "All" ? null : data?.content?.filter((t) => t.currency === c).length;
                      return (
                        <FilterPill
                          key={c}
                          label={c}
                          active={currencyFilter === c}
                          count={cnt}
                          onClick={() => {
                            setCategory(c);
                            setPage(1);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-widest mb-2">Status</p>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => {
                      const cnt = s === "All" ? null : data?.content?.filter((t) => t.status === s).length;
                      return (
                        <FilterPill
                          key={s}
                          label={s.charAt(0).toUpperCase() + s.slice(1)}
                          active={statusFilter === s}
                          count={cnt}
                          onClick={() => {
                            setStatus(s);
                            setPage(1);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                {(currencyFilter !== "All" || statusFilter !== "All" || typeFilter !== "All") && (
                  <button
                    onClick={() => {
                      setCategory("All");
                      setStatus("All");
                      setType("All");
                      setPage(1);
                    }}
                    className="self-start text-xs text-red-400/70 hover:text-red-400 transition-colors font-medium"
                  >
                    ✕ Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Table (desktop) ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-5 py-3.5 w-10">
                    <div
                      onClick={toggleAll}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all
                        ${allSelected ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-white/40"}`}
                    >
                      {allSelected && (
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
                  </th>
                  {colHeaders.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`px-4 py-3.5 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors select-none
                        ${col.right ? "text-right" : ""}`}
                    >
                      <span className="flex items-center gap-1 w-full justify-start">
                        {col.label}
                        <SortIcon dir={sortKey === col.key ? sortDir : null} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3.5 w-10" />
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-white/20 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl opacity-30">◎</span>
                        No transactions found
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((tx, i) => {
                    const cat = categoryIcon["Transfer"] || { bg: "bg-white/[0.06]", icon: "•" };
                    const stat = statusStyle[tx.status];
                    const isSel = selected.has(tx._id);
                    return (
                      <tr
                        key={tx._id}
                        className={`border-b border-white/[0.04] last:border-0 transition-all group cursor-pointer
                        ${isSel ? "bg-emerald-500/[0.04]" : "hover:bg-white/[0.025]"}`}
                        onClick={() => setDetailRow(tx)}
                      >
                        {/* select */}
                        <td
                          className="px-5 py-3.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(tx._id);
                          }}
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                          ${isSel ? "bg-emerald-500 border-emerald-500" : "border-white/15 hover:border-white/35"}`}
                          >
                            {isSel && (
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
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${stat.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        {/* Name + category */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center text-sm shrink-0`}
                            >
                              {cat.icon}
                            </div>
                            <div>
                              <p className="text-white/85 font-medium text-sm leading-tight">{tx.transactionId}</p>
                              <p className="text-white/30 text-xs mt-0.5 mono">{tx.referenceId}</p>
                            </div>
                          </div>
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3.5">
                          <p className="text-white/55 text-sm">{fmtTimeStampDate(tx.createdAt)}</p>
                        </td>
                        {/* remitter */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs font-medium mono text-white/40 bg-white/[0.05] border border-white/[0.07] px-2 py-1 rounded-md">
                            {tx.user?.firstName} {tx.user?.lastName}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs font-medium mono text-white/40 px-2 py-1 rounded-md">
                            {tx.vendor}
                          </span>
                        </td>
                        {/* Amount */}
                        <td className="px-4 py-3.5 text-right">
                          <p className={`font-semibold text-sm mono text-emerald-400`}>
                            {fmtAmount(tx.amount, tx.currency)}
                          </p>
                        </td>
                        {/* chevron */}
                        <td className="px-4 py-3.5">
                          <svg
                            viewBox="0 0 8 12"
                            className="w-2 h-3 text-white/15 group-hover:text-white/40 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l5 5-5 5" />
                          </svg>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card list ── */}
          <div className="md:hidden divide-y divide-white/[0.04]">
            {paginated.length === 0 ? (
              <div className="text-center py-12 text-white/20 text-sm">No transactions found</div>
            ) : (
              paginated.map((tx) => {
                const cat = categoryIcon["Transfer"] || { bg: "bg-white/[0.06]", icon: "•" };
                const stat = statusStyle[tx.status];
                return (
                  <div
                    key={tx._id}
                    onClick={() => setDetailRow(tx)}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.025] transition-all cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-lg ${cat.bg} flex items-center justify-center text-sm shrink-0`}>
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/85 font-medium text-sm truncate">{tx.transactionId}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white/30 text-xs mono">{tx.referenceId}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-semibold text-sm mono text-emerald-400`}>
                        {fmtAmount(tx.amount, tx.currency)}
                      </p>
                      <p className="text-white/25 text-xs">{fmtTimeStampDate(tx.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Bulk action bar ── */}
          {selected.size > 0 && (
            <div className="m-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <span className="text-emerald-400 text-sm font-medium">{selected.size} selected</span>
              <div className="flex-1" />
              <button className="text-xs text-white/50 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05]">
                Export
              </button>
              <button className="text-xs text-white/50 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05]">
                Mark reviewed
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                ✕ Clear
              </button>
            </div>
          )}

          {/* ── Pagination ── */}
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPage={(p) => setPage(p)}
            pageSize={pageSize}
            onPageSize={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            total={filtered.length}
            from={from}
            to={to}
          />
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      {detailRow && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setDetailRow(null)} />
          <div
            ref={detailRef}
            className="fixed right-0 top-0 h-full w-full md:max-w-xl bg-[#0f1117] border-l border-white/[0.07] z-50 flex flex-col shadow-2xl slide-in"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${(categoryIcon["Transfer"] || { bg: "bg-white/[0.06]" }).bg} flex items-center justify-center text-sm`}
                >
                  {(categoryIcon["Transfer"] || { icon: "•" }).icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{detailRow.transactionId} </p>
                </div>
              </div>

              {/* close icon */}
              <button
                onClick={() => setDetailRow(null)}
                className="text-white/25 hover:text-white/60 hover:bg-white/[0.06] rounded-lg p-1.5 transition-all"
              >
                <svg viewBox="0 0 14 14" className="w-4 h-4" fill="currentColor">
                  <path d="M3.293 3.293a1 1 0 011.414 0L7 5.586l2.293-2.293a1 1 0 111.414 1.414L8.414 7l2.293 2.293a1 1 0 01-1.414 1.414L7 8.414l-2.293 2.293a1 1 0 01-1.414-1.414L5.586 7 3.293 4.707a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>

            {/* Amount hero */}
            <div className="px-6 py-6 border-b border-white/[0.06]">
              <div className="flex justify-between">
                <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Amount </p>

                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle[detailRow.status].bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle[detailRow.status].dot}`} />
                  <span className="capitalize">{detailRow.status}</span>
                </span>
              </div>
              <p className={`text-3xl font-bold mono text-emerald-400`}>
                {fmtAmount(detailRow.amount, detailRow.currency)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/25 text-xs">{fmtTimeStampDate(detailRow.createdAt)}</span>
              </div>
            </div>

            {/* Details list */}
            <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
              <h1 className="text-white text-sm mb-3">Transaction Details</h1>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
                {[
                  ["Transaction ID", detailRow.transactionId],
                  ["Ref. ID", detailRow.referenceId],
                  ["Purpose Code", detailRow.purposeCode],
                  ["Vendor", detailRow.vendor],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3">
                    <span className="text-white/35 text-sm">{k}</span>
                    <span className="text-white/75 text-sm font-medium mono">{v}</span>
                  </div>
                ))}
              </div>

              <h1 className="text-white text-sm mb-3">Remitter Details</h1>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
                {[
                  ["Remitter Name", `${detailRow.user?.firstName} ${detailRow.user?.lastName}`],
                  ["Email", detailRow.user?.email],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3">
                    <span className="text-white/35 text-sm">{k}</span>
                    <span className="text-white/75 text-sm font-medium mono">{v}</span>
                  </div>
                ))}
              </div>

              {/* Fee Config */}
              <h1 className="text-white text-sm mb-3">Fee Structure</h1>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
                {[
                  ["Fx Rate", fmtAmount(detailRow?.feeConfig?.fxRate, "INR")],
                  ["Bank Fee", fmtAmount(detailRow?.feeConfig?.bankFee, "INR")],
                  ["Platform Fee", fmtAmount(detailRow?.feeConfig?.platformFee, "INR")],
                  ["FCCT", fmtAmount(detailRow?.feeConfig?.fcct, "INR")],
                  ["Total Payable", fmtAmount(detailRow?.feeConfig?.totalPayable, "INR")],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3">
                    <span className="text-white/35 text-sm">{k}</span>
                    <span className="text-white/75 text-sm font-medium mono">{v}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {/* <div className="mt-5 flex flex-col gap-2">
                <button className="w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.07] text-white/60 hover:text-white hover:bg-white/[0.09] text-sm font-medium transition-all">
                  Download Receipt
                </button>
                <button className="w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.07] text-white/60 hover:text-white hover:bg-white/[0.09] text-sm font-medium transition-all">
                  Flag for Review
                </button>
                {detailRow.status === "failed" && (
                  <button className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20">
                    Retry Transfer
                  </button>
                )}
              </div> */}
            </div>
          </div>
        </>
      )}
    </>
  );
}
