"use client";

import { Icon, ICONS } from "@/app/components/icons";
import { CURRENCIES } from "@/lib/currencies";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const STATUSES = ["All", "PENDING", "COMPLETED", "REJECTED"];
const TYPES = ["All", "PENDING"];
const PAGE_SIZES = [8, 15, 25];

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
  ACTIVE: {
    bg: "bg-accent/10 text-accent  border-[var(--border-clr)]",
    dot: "bg-accent",
  },
  PENDING: { bg: "bg-amber-500/10  text-amber-400  border-amber-500/20", dot: "bg-amber-400" },
  REJECTED: { bg: "bg-red-500/10    text-red-400    border-red-500/20", dot: "bg-red-400" },
  COMPLETED: { bg: "bg-teal-500/10    text-teal-400    border-teal-500/20", dot: "bg-teal-400" },
};

const categoryIcon = {
  Revenue: { bg: "bg-accent/10", icon: "💰" },
  Cloud: { bg: "bg-blue-500/10", icon: "☁️" },
  HR: { bg: "bg-violet-500/10", icon: "👥" },
  Refund: { bg: "bg-cyan-500/10", icon: "↩" },
  Transfer: { bg: "bg-orange-500/10", icon: "↗" },
  Marketing: { bg: "bg-pink-500/10", icon: "📣" },
  SaaS: { bg: "bg-indigo-500/10", icon: "⚡" },
  Services: { bg: "bg-teal-500/10", icon: "🔧" },
  Operations: { bg: "bg-yellow-500/10", icon: "🏢" },
  Tax: { bg: "bg-red-500/10", icon: "📋" },
  Funding: { bg: "bg-accent/10", icon: "🚀" },
};

// ── Sub-components ────────────────────────────────────────
const FilterPill = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 border
      ${
        active
          ? "bg-accent/10 text-accent border-emerald-500/25"
          : "bg-inputbg text-primary/45  border-[var(--border-clr)] hover:text-primary/70 hover:bg-inputbg"
      }`}
  >
    {label}
    {count != null && (
      <span
        className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${active ? "bg-accent/20" : "bg-inputbg"}`}
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t  border-[var(--border-clr)]">
      {/* Info + page size */}
      <div className="flex items-center gap-4">
        <span className="text-primary/50 text-xs font-mono">
          Showing{" "}
          <span className="text-primary/60">
            {from}–{to}
          </span>{" "}
          of <span className="text-primary/60">{total}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-primary/70 text-xs">Rows:</span>
          <div className="flex gap-1">
            {PAGE_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => onPageSize(s)}
                className={`w-7 h-6 rounded text-xs font-medium transition-all ${pageSize === s ? "bg-accent/15 text-accent" : "text-primary/50 hover:text-primary/60 hover:bg-inputbg"}`}
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
          className="w-8 h-8 rounded-lg flex items-center justify-center text-primary/50 hover:text-primary hover:bg-inputbg disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-primary/20 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all
                ${p === page ? "bg-accent text-primary shadow-md shadow-accent/30" : "text-primary/40 hover:text-primary hover:bg-inputbg"}`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-primary/50 hover:text-primary hover:bg-inputbg disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
        >
          ›
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────
export default function StudentsTable({ data = [] }) {
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
          t.userId.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.firstName.toLowerCase().includes(q),
      );
    }
    if (currencyFilter !== "All") d = d.filter((t) => t.currency === currencyFilter);
    if (statusFilter !== "All") d = d.filter((t) => t.kycStatus === statusFilter);
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
    { key: "kycStatus", label: "KYC Status" },
    { key: "name", label: "Full Name" },
    { key: "email", label: "email" },
    { key: "passport", label: "Passport Verified" },
    { key: "pan", label: "PAN Verified" },
    { key: "createdAt", label: "Created At", right: true },
  ];

  return (
    <>
      <div className="w-full">
        {/* ── Page header ── */}
        <div className="fade-up mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-primary text-xl font-semibold tracking-tight">List</h1>
              <p className="text-primary/50 text-sm mt-0.5">{filtered.length} records · last updated just now</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/75 hover:text-primary/80 hover:bg-inputbg text-sm font-medium transition-all"
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h10M5 8h6M7 13h2" />
                </svg>
                Export
              </button>
              <Link
                href={"/register"}
                target="_blank"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-all shadow-md shadow-accent/30"
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v12M2 8h12" />
                </svg>
                Add Student
              </Link>
            </div>
          </div>

          {/* Summary stat strip */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Transactions", value: ALL_TRANSACTIONS.length, suffix: "records", color: "text-primary" },
              { label: "Total Inflow", value: fmtAmount(totalCredit), color: "text-accent" },
              { label: "Total Outflow", value: fmtAmount(totalDebit), color: "text-red-400" },
              {
                label: "Net Balance",
                value: fmtAmount(totalCredit - totalDebit),
                color: totalCredit - totalDebit >= 0 ? "text-accent" : "text-red-400",
              },
            ].map((s) => (
              <div key={s.label} className="bg-card2 border  border-[var(--border-clr)] rounded-xl px-4 py-3">
                <p className="text-primary/50 text-[11px] uppercase tracking-wider font-medium mb-1">{s.label}</p>
                <p className={`${s.color} font-semibold text-base mono leading-tight`}>{s.value}</p>
              </div>
            ))}
          </div> */}
        </div>

        {/* ── Main panel ── */}
        <div className="fade-up bg-card rounded-2xl border  border-[var(--border-clr)] overflow-hidden shadow-md">
          {/* ── Toolbar ── */}
          <div className="px-5 py-4 border-b  border-[var(--border-clr)]">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 flex items-center gap-2.5 bg-inputbg border  border-[var(--border-clr)] rounded-xl px-3.5 py-2.5 focus-within:border-accent/50 transition-all">
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5 text-primary/50 shrink-0"
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
                  className="bg-transparent flex-1 outline-none text-sm text-primary placeholder:text-primary/70"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-primary/70 hover:text-primary/60 transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Type filter pills */}
              <div className="flex items-center gap-1.5 shrink-0">
                {STATUSES.map((t) => (
                  <FilterPill
                    key={t}
                    label={
                      t === "All" ? "All" : t === "PENDING" ? "Pending" : t === "COMPLETED" ? "Completed" : "Failed"
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
                  ${filtersOpen ? "bg-accent/10 border-emerald-500/25 text-accent" : "bg-inputbg  border-[var(--border-clr)] text-primary/45 hover:text-primary/70"}`}
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" d="M2 4h12M5 8h6M7 12h2" />
                </svg>
                Filters
                {(currencyFilter !== "All" || statusFilter !== "All") && (
                  <span className="w-4 h-4 rounded-full bg-accent text-primary text-[9px] font-bold flex items-center justify-center">
                    {(currencyFilter !== "All" ? 1 : 0) + (statusFilter !== "All" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded filters */}
            {filtersOpen && (
              <div className="mt-3 pt-3 border-t  border-[var(--border-clr)] flex flex-col gap-3">
                <div>
                  <p className="text-primary/70 text-[10px] uppercase tracking-widest mb-2">Status</p>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => {
                      const cnt = s === "All" ? null : data?.content?.filter((t) => t.kycStatus === s).length;
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
                {statusFilter !== "All" && (
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
                <tr className="border-b  border-[var(--border-clr)]">
                  <th className="px-5 py-3.5 w-10">
                    <div
                      onClick={toggleAll}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all
                        ${allSelected ? "bg-accent border-emerald-500" : "border-white/20 hover:border-white/40"}`}
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
                      className={`px-4 py-3.5 text-left text-[11px] font-semibold text-primary/50 uppercase tracking-wider cursor-pointer hover:text-primary/60 transition-colors select-none
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
                    <td colSpan={7} className="text-center py-16 text-primary/20 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl opacity-30">◎</span>
                        No Records found
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, i) => {
                    const cat = categoryIcon["HR"] || { bg: "bg-inputbg", icon: "•" };
                    const stat = statusStyle[item.kycStatus];
                    const isSel = selected.has(item._id);
                    return (
                      <tr
                        key={item._id}
                        className={`border-b  border-[var(--border-clr)] last:border-0 transition-all group cursor-pointer
                        ${isSel ? "bg-accent/[0.04]" : "hover:bg-inputbg"}`}
                        onClick={() => setDetailRow(item)}
                      >
                        {/* select */}
                        <td
                          className="px-5 py-3.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(item._id);
                          }}
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                          ${isSel ? "bg-accent border-emerald-500" : "border-white/15 hover:border-white/35"}`}
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
                            {item.kycStatus.charAt(0).toUpperCase() + item.kycStatus.slice(1)}
                          </span>
                        </td>

                        {/* Name  */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center text-sm shrink-0`}
                            >
                              {cat.icon}
                            </div>
                            <div>
                              <p className="text-primary/85 font-medium text-sm leading-tight">
                                {item?.firstName} {item?.lastName}
                              </p>
                              <p className="text-primary/50 text-xs mt-0.5 mono">{item.userId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-primary/55 text-sm">{item.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-primary/55 text-sm">{item.passport?.verified ? "Yes" : "No"}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-primary/55 text-sm">{item.pan?.verified ? "Yes" : "No"}</p>
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3.5">
                          <p className="text-primary/55 text-sm">{fmtTimeStampDate(item.createdAt)}</p>
                        </td>

                        {/* chevron */}
                        <td className="px-4 py-3.5">
                          <svg
                            viewBox="0 0 8 12"
                            className="w-2 h-3 text-primary/15 group-hover:text-primary/40 transition-colors"
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
              <div className="text-center py-12 text-primary/20 text-sm">No Records found</div>
            ) : (
              paginated.map((item) => {
                const cat = categoryIcon["Transfer"] || { bg: "bg-inputbg", icon: "•" };
                const stat = statusStyle[item.kycStatus];
                return (
                  <div
                    key={item._id}
                    onClick={() => setDetailRow(item)}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-inputbg transition-all cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-lg ${cat.bg} flex items-center justify-center text-sm shrink-0`}>
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary/85 font-medium text-sm truncate">
                        {item.firstName} {item?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-primary/50 text-xs mono">{item.userId}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Bulk action bar ── */}
          {selected.size > 0 && (
            <div className="m-2 px-4 py-3 rounded-xl bg-accent/10 border  border-[var(--border-clr)] flex items-center gap-3">
              <span className="text-accent text-sm font-medium">{selected.size} selected</span>
              <div className="flex-1" />
              <button className="text-xs text-primary/75 hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-inputbg">
                Export
              </button>
              <button className="text-xs text-primary/75 hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-inputbg">
                Mark reviewed
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs text-primary/50 hover:text-primary/60 transition-colors"
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
            className="fixed right-0 top-0 h-full w-full md:max-w-xl bg-card border-l  border-[var(--border-clr)] z-50 flex flex-col shadow-md slide-in"
          >
            <div className="h-px w-full bg-gradient-to-r from-bg-card via-emerald-500/40 from-bg-card" />

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b  border-[var(--border-clr)]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${(categoryIcon["Transfer"] || { bg: "bg-inputbg" }).bg} flex items-center justify-center text-sm`}
                >
                  {(categoryIcon["HR"] || { icon: "•" }).icon}
                </div>
                <div>
                  <p className="text-primary font-semibold text-sm">{detailRow.userId} </p>
                </div>
              </div>

              {/* close icon */}
              <button
                onClick={() => setDetailRow(null)}
                className="text-primary/70 hover:text-primary/60 hover:bg-inputbg rounded-lg p-1.5 transition-all"
              >
                <svg viewBox="0 0 14 14" className="w-4 h-4" fill="currentColor">
                  <path d="M3.293 3.293a1 1 0 011.414 0L7 5.586l2.293-2.293a1 1 0 111.414 1.414L8.414 7l2.293 2.293a1 1 0 01-1.414 1.414L7 8.414l-2.293 2.293a1 1 0 01-1.414-1.414L5.586 7 3.293 4.707a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>

            {/* info hero */}
            <div className="px-6 py-6 border-b  border-[var(--border-clr)]">
              <div className="flex justify-between">
                <p className="text-primary/50 text-xs uppercase tracking-wider mb-1">{detailRow?.role} </p>

                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle[detailRow.kycStatus].bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle[detailRow.kycStatus].dot}`} />
                  <span className="capitalize">{detailRow.kycStatus}</span>
                </span>
              </div>
              <p className={`text-3xl font-bold mono text-accent`}>
                {`${detailRow?.firstName} ${detailRow?.lastName}`}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-primary/70 text-xs">{fmtTimeStampDate(detailRow.createdAt)}</span>
              </div>
            </div>

            {/* Details list */}
            <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
              {/* info */}
              <h1 className="text-primary text-sm mb-3">Basic Details</h1>
              <div className="rounded-xl border  border-[var(--border-clr)] bg-inputbg divide-y divide-white/[0.04] overflow-hidden">
                {[
                  ["First Name", `${detailRow?.firstName}`],
                  ["Last Name", `${detailRow?.lastName}`],
                  ["Email Address", `${detailRow?.email}`],
                  ["User ID", `${detailRow?.userId}`],
                  ["D.O.B", `${detailRow?.passport?.dob}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3">
                    <span className="text-primary/50 text-sm capitalize">{k}</span>
                    <span className="text-primary/75 text-sm font-medium mono">{v}</span>
                  </div>
                ))}
              </div>

              <h1 className="text-primary text-sm mb-3">Passport Details</h1>
              <div className="rounded-xl border  border-[var(--border-clr)] bg-inputbg divide-y divide-white/[0.04] overflow-hidden">
                {[
                  ["passport Number", `${detailRow?.passport?.passportNumber}`],
                  ["passport File No.", `${detailRow?.passport?.fileNumber}`],
                  ["D.O.B", `${detailRow?.passport?.dob}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3">
                    <span className="text-primary/50 text-sm capitalize">{k}</span>
                    <span className="text-primary/75 text-sm font-medium mono">{v}</span>
                  </div>
                ))}

                {detailRow?.passport?.verified ? (
                  <>
                    <div className="flex items-center justify-between px-4 py-3 bg-accent/10">
                      <span className="text-primary/50 text-sm capitalize">Verfication Status</span>
                      <span className="text-primary/75 text-sm font-medium mono flex gap-2">
                        Passport Verfied <Icon path={ICONS.shield} />
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-4 py-3 bg-red-400/10">
                      <span className="text-primary/50 text-sm capitalize">Verfication Status</span>
                      <span className="text-primary/75 text-sm font-medium mono flex gap-2">
                        Not Verfied <Icon path={ICONS.eyeOff} />
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* PAN */}

              {detailRow?.pan ? (
                <>
                  <h1 className="text-primary text-sm mb-3">PAN Details</h1>
                  <div className="rounded-xl border  border-[var(--border-clr)] bg-inputbg divide-y divide-white/[0.04] overflow-hidden">
                    {[["PAN", `${detailRow?.pan?.panNumber}`]].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between px-4 py-3">
                        <span className="text-primary/50 text-sm capitalize">{k}</span>
                        <span className="text-primary/75 text-sm font-medium mono">{!v ? "-" : v}</span>
                      </div>
                    ))}

                    {detailRow?.pan?.verified ? (
                      <>
                        <div className="flex items-center justify-between px-4 py-3 bg-accent/10">
                          <span className="text-primary/50 text-sm capitalize">Verfication Status</span>
                          <span className="text-primary/75 text-sm font-medium mono flex gap-2">
                            PAN Verfied <Icon path={ICONS.shield} />
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between px-4 py-3 bg-red-400/10">
                          <span className="text-primary/50 text-sm capitalize">Verfication Status</span>
                          <span className="text-primary/75 text-sm font-medium mono flex gap-2">
                            Not Verfied <Icon path={ICONS.eyeOff} />
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* Actions */}
              {/* <div className="mt-5 flex flex-col gap-2">
                <button className="w-full py-2.5 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/60 hover:text-primary hover:bg-inputbg text-sm font-medium transition-all">
                  Download Receipt
                </button>
                <button className="w-full py-2.5 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/60 hover:text-primary hover:bg-inputbg text-sm font-medium transition-all">
                  Flag for Review
                </button>
                {detailRow.kycStatus === "failed" && (
                  <button className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-all shadow-md shadow-accent/30">
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
