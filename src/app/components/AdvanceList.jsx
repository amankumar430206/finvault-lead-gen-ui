import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ═════════════════════════════════════════════════════════════
//  ADVANCED LIST — Generic Reusable Component
// ═════════════════════════════════════════════════════════════
/**
 * AdvancedList<T>
 *
 * A fully generic, headless-style list component that works with
 * any data shape via render props and config.
 *
 * Core Props:
 *   items            T[]                     — data array
 *   getItemId        (item: T) => string|num  — unique ID accessor
 *
 * Render Props (all optional — compose as needed):
 *   renderItem       (item, ctx) => ReactNode — how each row looks
 *   renderEmpty      () => ReactNode          — empty/no-results state
 *   renderHeader     () => ReactNode          — slot above the search bar
 *   renderFooter     (ctx) => ReactNode       — slot below the list
 *   renderChip       (item) => ReactNode      — multi-select chip (defaults to getLabel)
 *
 * Search:
 *   searchable       boolean (default true)
 *   searchPlaceholder string
 *   searchKeys       string[]  — dot-notation keys to search, e.g. ["name","email","role.name"]
 *   onSearch         (q) => void — external search override
 *
 * Filtering:
 *   filters          FilterConfig[]
 *     { key, label, options: [{value, label, count?}] }
 *   onFilter         (key, value) => void
 *
 * Selection:
 *   selectable       boolean (default false)
 *   mode             "single" | "multi" (default "single")
 *   selectedId       string|num           — controlled single
 *   selectedIds      (string|num)[]       — controlled multi
 *   onSelect         (item) => void
 *   onSelectMany     (items[]) => void
 *   isDisabled       (item) => boolean
 *
 * Sorting:
 *   sortable         boolean (default false)
 *   sortOptions      {key, label}[]
 *   defaultSortKey   string
 *   defaultSortDir   "asc"|"desc"
 *   getSortValue     (item, key) => any
 *
 * Grouping:
 *   groupBy          (item) => string       — group key extractor
 *   renderGroupHeader (group, items) => ReactNode
 *
 * Pagination:
 *   paginated        boolean (default false)
 *   pageSize         number (default 10)
 *   pageSizeOptions  number[]
 *
 * Layout:
 *   layout           "list" | "grid"  (default "list")
 *   gridCols         string           — tailwind cols class, default "grid-cols-2"
 *   maxHeight        string           — tailwind max-h class, default "max-h-[480px]"
 *   className        string
 */

// ─────────────────────────────────────────────────────────────
// INTERNAL UTILITIES
// ─────────────────────────────────────────────────────────────

export const get = (obj, path) => path.split(".").reduce((o, k) => o?.[k], obj) ?? "";

export const normalize = (v) => String(v ?? "").toLowerCase();

export const highlight = (text = "", query = "") => {
  const str = String(text);
  if (!query.trim()) return <span>{str}</span>;
  const idx = str.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{str}</span>;
  return (
    <>
      {str.slice(0, idx)}
      <mark className="bg-emerald-500/25 text-emerald-300 rounded-sm px-0.5 not-italic">
        {str.slice(idx, idx + query.length)}
      </mark>
      {str.slice(idx + query.length)}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SEARCH BAR
// ─────────────────────────────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder, chips, onRemoveChip }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="px-4 py-3 border-b border-white/[0.06]">
      {chips?.length > 0 && <div className="flex flex-wrap gap-1.5 mb-2.5">{chips}</div>}
      <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3.5 py-2.5 focus-within:border-emerald-500/40 transition-all">
        <svg
          viewBox="0 0 16 16"
          className="w-3.5 h-3.5 text-white/25 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path strokeLinecap="round" d="M11 11l3 3" />
        </svg>
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/25"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="text-white/25 hover:text-white/60 transition-colors leading-none"
          >
            <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M2 2l6 6M8 2L2 8" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────────────────────
export const FilterBar = ({ filters, activeFilters, onChange }) => (
  <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-4 overflow-x-auto scrollbar-none">
    {filters.map((f) => (
      <div key={f.key} className="flex items-center gap-1.5 shrink-0">
        <span className="text-white/25 text-[11px] font-semibold uppercase tracking-wider shrink-0">{f.label}:</span>
        <div className="flex gap-1">
          {f.options.map((opt) => {
            const active = (activeFilters[f.key] ?? "all") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(f.key, opt.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border whitespace-nowrap
                  ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/65 hover:bg-white/[0.06]"
                  }`}
              >
                {opt.label}
                {opt.count != null && (
                  <span
                    className={`ml-1.5 text-[10px] rounded-full px-1 ${active ? "bg-emerald-500/20" : "bg-white/[0.08]"}`}
                  >
                    {opt.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// SORT BAR
// ─────────────────────────────────────────────────────────────
export const SortBar = ({ options, sortKey, sortDir, onChange }) => (
  <div className="px-4 py-2 border-b border-white/[0.05] flex items-center gap-2 overflow-x-auto">
    <span className="text-white/25 text-[11px] font-semibold uppercase tracking-wider shrink-0">Sort:</span>
    {options.map((opt) => {
      const active = sortKey === opt.key;
      return (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key, active ? (sortDir === "asc" ? "desc" : "asc") : "desc")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border whitespace-nowrap
            ${
              active
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/65"
            }`}
        >
          {opt.label}
          {active && (
            <svg viewBox="0 0 8 10" className="w-2 h-2.5" fill="currentColor">
              <path d={sortDir === "asc" ? "M4 0L7.5 5H0.5L4 0Z" : "M4 10L0.5 5H7.5L4 10Z"} />
            </svg>
          )}
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────
export const Pagination = ({ page, total, pageSize, pageSizeOptions, onPage, onPageSize }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total);

  const pages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "…", totalPages];
    if (page >= totalPages - 2) return [1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.05]">
      <div className="flex items-center gap-3">
        <span className="text-white/30 text-xs font-mono">
          {from}–{to} <span className="text-white/20">of</span> {total}
        </span>
        {pageSizeOptions?.length > 1 && (
          <div className="flex gap-1">
            {pageSizeOptions.map((s) => (
              <button
                key={s}
                onClick={() => onPageSize(s)}
                className={`w-7 h-6 rounded text-xs font-medium transition-all
                  ${pageSize === s ? "bg-emerald-500/15 text-emerald-400" : "text-white/30 hover:text-white/55 hover:bg-white/[0.05]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-7 h-7 rounded-lg text-sm text-white/30 hover:text-white hover:bg-white/[0.06] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-white/20 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all
                  ${p === page ? "bg-emerald-500 text-white shadow shadow-emerald-500/25" : "text-white/40 hover:text-white hover:bg-white/[0.06]"}`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-7 h-7 rounded-lg text-sm text-white/30 hover:text-white hover:bg-white/[0.06] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
        >
          ›
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SELECT-ALL BAR
// ─────────────────────────────────────────────────────────────
export const SelectAllBar = ({ count, total, onSelectAll, onClear }) => (
  <div className="mx-3 mb-2 px-4 py-2.5 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/20 flex items-center gap-3">
    <div
      onClick={onSelectAll}
      className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center cursor-pointer shrink-0"
    >
      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
        <path
          d="M1.5 5l2.5 2.5 4.5-4.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span className="text-white/50 text-xs flex-1">
      <span className="text-emerald-400 font-semibold">{count}</span> of {total} selected
    </span>
    <button onClick={onSelectAll} className="text-xs text-white/35 hover:text-white/65 transition-colors">
      Select all {total}
    </button>
    <span className="text-white/15">·</span>
    <button onClick={onClear} className="text-xs text-white/35 hover:text-white/65 transition-colors">
      Clear
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────
// DEFAULT EMPTY STATE
// ─────────────────────────────────────────────────────────────
export const DefaultEmpty = ({ query, onClear }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-2 px-6">
    <span className="text-3xl opacity-15">◎</span>
    <p className="text-white/30 text-sm">{query ? `No results for "${query}"` : "Nothing here yet"}</p>
    {query && (
      <button onClick={onClear} className="text-emerald-400/70 hover:text-emerald-400 text-xs transition-colors mt-1">
        Clear search
      </button>
    )}
  </div>
);

// ═════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═════════════════════════════════════════════════════════════
export const AdvancedList = ({
  // Data
  items = [],
  getItemId,

  // Render props
  renderItem,
  renderEmpty,
  renderHeader,
  renderFooter,
  renderChip,

  // Search
  searchable = true,
  searchPlaceholder = "Search…",
  searchKeys = [],
  onSearch,

  // Filters
  filters = [],
  onFilter,

  // Selection
  selectable = false,
  mode = "single",
  selectedId,
  selectedIds = [],
  onSelect,
  onSelectMany,
  isDisabled,

  // Sort
  sortable = false,
  sortOptions = [],
  defaultSortKey,
  defaultSortDir = "desc",
  getSortValue,

  // Grouping
  groupBy,
  renderGroupHeader,

  // Pagination
  paginated = false,
  pageSize: pageSizeProp = 10,
  pageSizeOptions = [],

  // Layout
  layout = "list",
  gridCols = "grid-cols-2",
  maxHeight = "max-h-[480px]",

  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [sortKey, setSortKey] = useState(defaultSortKey ?? sortOptions[0]?.key ?? "");
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeProp);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [query, activeFilters, sortKey, sortDir]);

  const handleSearch = (q) => {
    setQuery(q);
    onSearch?.(q);
  };

  const handleFilter = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    onFilter?.(key, value);
  };

  const handleSort = (key, dir) => {
    setSortKey(key);
    setSortDir(dir);
  };

  // ── Pipeline: filter → search → sort → paginate ──────────
  const processed = useMemo(() => {
    let d = [...items];

    // Filter
    Object.entries(activeFilters).forEach(([fk, fv]) => {
      if (!fv || fv === "all") return;
      d = d.filter((item) => normalize(get(item, fk)) === normalize(fv));
    });

    // Search
    if (query.trim() && searchKeys.length > 0) {
      const q = query.toLowerCase();
      d = d.filter((item) => searchKeys.some((k) => normalize(get(item, k)).includes(q)));
    }

    // Sort
    if (sortKey && getSortValue) {
      d.sort((a, b) => {
        const va = getSortValue(a, sortKey);
        const vb = getSortValue(b, sortKey);
        if (va == null) return 1;
        if (vb == null) return -1;
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return d;
  }, [items, activeFilters, query, searchKeys, sortKey, sortDir, getSortValue]);

  // Pagination slice
  const totalItems = processed.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = paginated ? processed.slice((safePage - 1) * pageSize, safePage * pageSize) : processed;

  // Grouping
  const grouped = useMemo(() => {
    if (!groupBy) return { "": visible };
    return visible.reduce((acc, item) => {
      const key = String(groupBy(item) ?? "Other");
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [visible, groupBy]);

  // Selection helpers
  const isSelected = useCallback(
    (item) => {
      const id = getItemId(item);
      return mode === "multi" ? selectedIds.includes(id) : selectedId === id;
    },
    [mode, selectedId, selectedIds, getItemId],
  );

  const handleSelect = useCallback(
    (item) => {
      if (isDisabled?.(item)) return;
      const id = getItemId(item);
      if (mode === "single") {
        onSelect?.(item);
      } else {
        const next = selectedIds.includes(id)
          ? items.filter((i) => selectedIds.includes(getItemId(i)) && getItemId(i) !== id)
          : [...items.filter((i) => selectedIds.includes(getItemId(i))), item];
        onSelectMany?.(next);
      }
    },
    [mode, selectedIds, items, getItemId, isDisabled, onSelect, onSelectMany],
  );

  const handleSelectAll = () => onSelectMany?.(processed);
  const handleClearAll = () => onSelectMany?.([]);

  // Context passed to render props
  const ctx = {
    query,
    isSelected,
    handleSelect,
    selectedCount: mode === "multi" ? selectedIds.length : selectedId != null ? 1 : 0,
  };

  // Multi-select chips
  const chips =
    mode === "multi" && selectedIds.length > 0
      ? items
          .filter((i) => selectedIds.includes(getItemId(i)))
          .map((item) =>
            renderChip ? (
              renderChip(item, () => handleSelect(item))
            ) : (
              <span
                key={getItemId(item)}
                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium"
              >
                {searchKeys[0] ? String(get(item, searchKeys[0])).split(" ")[0] : getItemId(item)}
                <button onClick={() => handleSelect(item)} className="opacity-60 hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" d="M2 2l6 6M8 2L2 8" />
                  </svg>
                </button>
              </span>
            ),
          )
      : null;

  const hasAnyBar = searchable || filters.length > 0 || sortable;
  const showSelectAll = mode === "multi" && selectable && ctx.selectedCount > 0 && ctx.selectedCount < totalItems;

  return (
    <div className={`flex flex-col bg-[#0f1117] rounded-2xl border border-white/[0.07] overflow-hidden ${className}`}>
      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent shrink-0" />

      {/* Header slot */}
      {renderHeader?.()}

      {/* Search */}
      {searchable && <SearchBar value={query} onChange={handleSearch} placeholder={searchPlaceholder} chips={chips} />}

      {/* Filters */}
      {filters.length > 0 && <FilterBar filters={filters} activeFilters={activeFilters} onChange={handleFilter} />}

      {/* Sort */}
      {sortable && sortOptions.length > 0 && (
        <SortBar options={sortOptions} sortKey={sortKey} sortDir={sortDir} onChange={handleSort} />
      )}

      {/* Select-all bar */}
      {showSelectAll && (
        <SelectAllBar
          count={ctx.selectedCount}
          total={totalItems}
          onSelectAll={handleSelectAll}
          onClear={handleClearAll}
        />
      )}

      {/* List body */}
      <div className={`overflow-y-auto overscroll-contain flex-1 ${maxHeight}`}>
        {visible.length === 0
          ? (renderEmpty?.() ?? <DefaultEmpty query={query} onClear={() => setQuery("")} />)
          : Object.entries(grouped).map(([group, groupItems]) => (
              <div key={group}>
                {/* Group header */}
                {groupBy &&
                  group &&
                  (renderGroupHeader ? (
                    renderGroupHeader(group, groupItems)
                  ) : (
                    <div className="px-4 py-2 bg-white/[0.02] border-y border-white/[0.04] flex items-center gap-2 sticky top-0 z-10 backdrop-blur-sm">
                      <span className="text-[11px] font-semibold text-white/35 uppercase tracking-wider">{group}</span>
                      <span className="text-[10px] text-white/20 bg-white/[0.05] rounded-full px-1.5 py-0.5">
                        {groupItems.length}
                      </span>
                    </div>
                  ))}

                {/* Items */}
                <div className={layout === "grid" ? `grid ${gridCols} gap-0` : ""}>
                  {groupItems.map((item) =>
                    renderItem ? (
                      renderItem(item, ctx)
                    ) : (
                      // Default row — works for any flat object
                      <div
                        key={getItemId(item)}
                        onClick={() => selectable && handleSelect(item)}
                        className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 transition-all
                            ${selectable && !isDisabled?.(item) ? "cursor-pointer hover:bg-white/[0.03]" : ""}
                            ${isSelected(item) ? "bg-emerald-500/[0.06]" : ""}
                            ${isDisabled?.(item) ? "opacity-40 pointer-events-none" : ""}`}
                      >
                        {selectable && mode === "multi" && (
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
                              ${isSelected(item) ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}
                          >
                            {isSelected(item) && (
                              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                                <path
                                  d="M1.5 5l2.5 2.5 4.5-4.5"
                                  stroke="white"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white/75 text-sm truncate">{getItemId(item)}</p>
                        </div>
                        {selectable && mode === "single" && isSelected(item) && (
                          <svg
                            viewBox="0 0 16 16"
                            className="w-4 h-4 text-emerald-400 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5L13 4" />
                          </svg>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {paginated && totalItems > 0 && (
        <Pagination
          page={safePage}
          total={totalItems}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPage={setPage}
          onPageSize={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      )}

      {/* Footer slot */}
      {renderFooter?.(ctx)}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
//  DEMO — 3 real-world examples
// ═════════════════════════════════════════════════════════════

// ── Demo data ─────────────────────────────────────────────

export const statusColor = {
  online: "bg-emerald-400",
  busy: "bg-amber-400",
  away: "bg-orange-400",
  offline: "bg-white/20",
};

export const USERS = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@finvault.io",
    role: "Admin",
    dept: "Engineering",
    status: "online",
    joined: "Jan 2024",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@finvault.io",
    role: "Agent",
    dept: "Product",
    status: "busy",
    joined: "Mar 2024",
  },
  {
    id: 3,
    name: "Alice Wang",
    email: "alice@finvault.io",
    role: "User",
    dept: "Design",
    status: "away",
    joined: "Feb 2024",
  },
  {
    id: 4,
    name: "Bob Martinez",
    email: "bob@finvault.io",
    role: "Agent",
    dept: "Engineering",
    status: "offline",
    joined: "Apr 2024",
  },
  {
    id: 5,
    name: "Clara Kent",
    email: "clara@finvault.io",
    role: "Admin",
    dept: "Finance",
    status: "online",
    joined: "Jan 2024",
  },
  {
    id: 6,
    name: "Dev Patel",
    email: "dev@finvault.io",
    role: "User",
    dept: "Marketing",
    status: "online",
    joined: "Jun 2024",
  },
  {
    id: 7,
    name: "Eva Chen",
    email: "eva@finvault.io",
    role: "Owner",
    dept: "Leadership",
    status: "online",
    joined: "Jan 2024",
  },
  {
    id: 8,
    name: "Frank Müller",
    email: "frank@finvault.io",
    role: "Agent",
    dept: "Engineering",
    status: "busy",
    joined: "May 2024",
  },
  {
    id: 9,
    name: "Grace Lee",
    email: "grace@finvault.io",
    role: "User",
    dept: "Support",
    status: "offline",
    joined: "Jul 2024",
  },
  {
    id: 10,
    name: "Hassan Tariq",
    email: "hassan@finvault.io",
    role: "User",
    dept: "Sales",
    status: "online",
    joined: "Aug 2024",
  },
];

export const TRANSACTIONS = [
  {
    id: "TXN-001",
    name: "Stripe Payout",
    category: "Revenue",
    status: "completed",
    amount: 4200,
    currency: "USD",
    date: "Feb 24",
  },
  {
    id: "TXN-002",
    name: "AWS Billing",
    category: "Cloud",
    status: "completed",
    amount: 890,
    currency: "USD",
    date: "Feb 23",
  },
  {
    id: "TXN-003",
    name: "Payroll Run",
    category: "HR",
    status: "pending",
    amount: 12400,
    currency: "USD",
    date: "Feb 22",
  },
  {
    id: "TXN-004",
    name: "Google Ads",
    category: "Marketing",
    status: "completed",
    amount: 620,
    currency: "USD",
    date: "Feb 21",
  },
  {
    id: "TXN-005",
    name: "Wise Transfer",
    category: "Transfer",
    status: "failed",
    amount: 3100,
    currency: "USD",
    date: "Feb 20",
  },
  {
    id: "TXN-006",
    name: "Shopify Revenue",
    category: "Revenue",
    status: "completed",
    amount: 7830,
    currency: "USD",
    date: "Feb 19",
  },
  {
    id: "TXN-007",
    name: "Notion SaaS",
    category: "SaaS",
    status: "completed",
    amount: 48,
    currency: "USD",
    date: "Feb 18",
  },
  {
    id: "TXN-008",
    name: "Freelancer",
    category: "Services",
    status: "pending",
    amount: 1250,
    currency: "USD",
    date: "Feb 17",
  },
  {
    id: "TXN-009",
    name: "Tax Payment",
    category: "Tax",
    status: "completed",
    amount: 22000,
    currency: "USD",
    date: "Feb 16",
  },
  {
    id: "TXN-010",
    name: "VC Deposit",
    category: "Funding",
    status: "completed",
    amount: 50000,
    currency: "USD",
    date: "Feb 15",
  },
  {
    id: "TXN-011",
    name: "Azure DevOps",
    category: "Cloud",
    status: "completed",
    amount: 340,
    currency: "USD",
    date: "Feb 14",
  },
  {
    id: "TXN-012",
    name: "HubSpot CRM",
    category: "SaaS",
    status: "pending",
    amount: 450,
    currency: "USD",
    date: "Feb 13",
  },
];

export const REPOS = [
  { id: 1, name: "finvault-api", lang: "TypeScript", stars: 248, forks: 34, status: "active", updated: "2h ago" },
  { id: 2, name: "finvault-web", lang: "React", stars: 190, forks: 21, status: "active", updated: "4h ago" },
  { id: 3, name: "payments-service", lang: "Go", stars: 87, forks: 12, status: "active", updated: "1d ago" },
  { id: 4, name: "ml-fraud-detect", lang: "Python", stars: 312, forks: 55, status: "archived", updated: "1mo ago" },
  { id: 5, name: "mobile-app", lang: "React Native", stars: 145, forks: 18, status: "active", updated: "6h ago" },
  { id: 6, name: "design-system", lang: "TypeScript", stars: 203, forks: 29, status: "active", updated: "3d ago" },
  { id: 7, name: "data-pipeline", lang: "Python", stars: 67, forks: 8, status: "archived", updated: "2mo ago" },
  { id: 8, name: "auth-service", lang: "Go", stars: 134, forks: 16, status: "active", updated: "12h ago" },
];

export const langColor = {
  TypeScript: "bg-blue-500/15 text-blue-400",
  React: "bg-cyan-500/15 text-cyan-400",
  Go: "bg-teal-500/15 text-teal-400",
  Python: "bg-yellow-500/15 text-yellow-400",
  "React Native": "bg-sky-500/15 text-sky-400",
};
export const txStatus = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};
export const roleColor = {
  Admin: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Owner: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Agent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  User: "bg-white/[0.07] text-white/45 border-white/[0.08]",
};
export const getInit = (n = "") =>
  n
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// ─────────────────────────────────────────────────────────────
// DEMO COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Demo() {
  // Example 1 — Users
  const [selUsers, setSelUsers] = useState([]);
  // Example 2 — Transactions
  const [selTx, setSelTx] = useState(null);
  // Example 3 — Repos (grid)
  const [selRepos, setSelRepos] = useState([]);

  const SectionLabel = ({ title, sub }) => (
    <div className="mb-4">
      <h2 className="text-white font-semibold text-base">{title}</h2>
      <p className="text-white/30 text-xs mt-0.5">{sub}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0d12] p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
            F
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">AdvancedList</h1>
          <span className="text-xs font-medium bg-white/[0.07] text-white/45 px-2 py-0.5 rounded-full">
            Generic Component
          </span>
        </div>
        <p className="text-white/35 text-sm ml-12">
          One component · any data shape · render props · search · filter · sort · group · paginate · select
        </p>
      </div>

      <div className="flex flex-col gap-12 max-w-5xl">
        {/* ══ EXAMPLE 1: USERS — multi-select, grouped, searchable ══ */}
        <div>
          <SectionLabel
            title="Example 1 — Users"
            sub="mode=multi · groupBy=role · searchKeys=[name,email] · selectable"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdvancedList
              items={USERS}
              getItemId={(u) => u.id}
              searchable
              searchPlaceholder="Search by name or email…"
              searchKeys={["name", "email", "dept"]}
              selectable
              mode="multi"
              selectedIds={selUsers}
              onSelectMany={(us) => setSelUsers(us.map((u) => u.id))}
              groupBy={(u) => u.role}
              renderGroupHeader={(group, items) => (
                <div className="px-4 py-2 bg-white/[0.02] border-y border-white/[0.04] flex items-center gap-2 sticky top-0 backdrop-blur-sm z-10">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleColor[group] ?? roleColor.User}`}
                  >
                    {group}
                  </span>
                  <span className="text-white/20 text-xs">{items.length}</span>
                </div>
              )}
              renderItem={(user, ctx) => {
                const sel = ctx.isSelected(user);
                return (
                  <div
                    key={user.id}
                    onClick={() => ctx.handleSelect(user)}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 cursor-pointer transition-all
                      ${sel ? "bg-emerald-500/[0.07]" : "hover:bg-white/[0.03]"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
                      ${sel ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-white/40"}`}
                    >
                      {sel && (
                        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                          <path
                            d="M1.5 5l2.5 2.5 4.5-4.5"
                            stroke="white"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-xs font-semibold text-white">
                        {getInit(user.name)}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0f1117] ${statusColor[user.status]}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${sel ? "text-white" : "text-white/75"}`}>
                        {highlight(user.name, ctx.query)}
                      </p>
                      <p className="text-xs text-white/30 truncate">{highlight(user.email, ctx.query)}</p>
                    </div>
                    <span className="text-xs text-white/25 shrink-0">{user.dept}</span>
                  </div>
                );
              }}
              renderFooter={(ctx) =>
                ctx.selectedCount > 0 && (
                  <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-white/35 text-xs">
                      <span className="text-emerald-400 font-semibold">{ctx.selectedCount}</span> selected
                    </span>
                    <button
                      onClick={() => setSelUsers([])}
                      className="text-xs text-white/30 hover:text-white/60 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )
              }
              maxHeight="max-h-80"
            />

            {/* Selection result panel */}
            <div className="bg-[#13161f] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-white/45 text-xs uppercase tracking-wider font-semibold">Selected Users</p>
              {selUsers.length === 0 ? (
                <p className="text-white/20 text-sm flex-1 flex items-center">None selected yet</p>
              ) : (
                USERS.filter((u) => selUsers.includes(u.id)).map((u) => (
                  <div key={u.id} className="flex items-center gap-2.5 py-2 border-b border-white/[0.04] last:border-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {getInit(u.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{u.name}</p>
                      <p className="text-white/30 text-xs truncate">{u.email}</p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${roleColor[u.role] ?? roleColor.User}`}
                    >
                      {u.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ══ EXAMPLE 2: TRANSACTIONS — filters, sort, paginate, single-select ══ */}
        <div>
          <SectionLabel title="Example 2 — Transactions" sub="filters · sortable · paginated · mode=single" />
          <AdvancedList
            items={TRANSACTIONS}
            getItemId={(t) => t.id}
            searchable
            searchPlaceholder="Search transactions…"
            searchKeys={["name", "category", "id"]}
            selectable
            mode="single"
            selectedId={selTx?.id}
            onSelect={setSelTx}
            sortable
            sortOptions={[
              { key: "amount", label: "Amount" },
              { key: "date", label: "Date" },
              { key: "name", label: "Name" },
            ]}
            getSortValue={(t, k) => (k === "amount" ? t.amount : k === "date" ? t.id : t.name)}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "all", label: "All" },
                  {
                    value: "completed",
                    label: "Completed",
                    count: TRANSACTIONS.filter((t) => t.status === "completed").length,
                  },
                  {
                    value: "pending",
                    label: "Pending",
                    count: TRANSACTIONS.filter((t) => t.status === "pending").length,
                  },
                  { value: "failed", label: "Failed", count: TRANSACTIONS.filter((t) => t.status === "failed").length },
                ],
              },
              {
                key: "category",
                label: "Category",
                options: [
                  { value: "all", label: "All" },
                  { value: "Revenue", label: "Revenue" },
                  { value: "Cloud", label: "Cloud" },
                  { value: "HR", label: "HR" },
                  { value: "SaaS", label: "SaaS" },
                  { value: "Funding", label: "Funding" },
                ],
              },
            ]}
            paginated
            pageSize={5}
            pageSizeOptions={[5, 8, 12]}
            renderItem={(tx, ctx) => {
              const sel = ctx.isSelected(tx);
              const isCredit = ["Revenue", "Funding"].includes(tx.category);
              return (
                <div
                  key={tx.id}
                  onClick={() => ctx.handleSelect(tx)}
                  className={`flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-0 cursor-pointer transition-all
                    ${sel ? "bg-emerald-500/[0.07]" : "hover:bg-white/[0.03]"}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${sel ? "text-white" : "text-white/75"}`}>
                      {highlight(tx.name, ctx.query)}
                    </p>
                    <p className="text-xs text-white/30 font-mono">
                      {tx.id} · {tx.date}
                    </p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${txStatus[tx.status]}`}>
                    {tx.status}
                  </span>
                  <span className={`text-sm font-semibold font-mono ${isCredit ? "text-emerald-400" : "text-red-400"}`}>
                    {isCredit ? "+" : "–"}${tx.amount.toLocaleString()}
                  </span>
                  {sel && (
                    <svg
                      viewBox="0 0 16 16"
                      className="w-4 h-4 text-emerald-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5L13 4" />
                    </svg>
                  )}
                </div>
              );
            }}
            renderFooter={(ctx) =>
              selTx && (
                <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                  <span className="text-white/40 text-xs">
                    Selected: <span className="text-white/70 font-medium">{selTx.name}</span>
                  </span>
                  <button
                    onClick={() => setSelTx(null)}
                    className="text-xs text-white/25 hover:text-white/55 transition-colors"
                  >
                    ✕ Clear
                  </button>
                </div>
              )
            }
          />
        </div>

        {/* ══ EXAMPLE 3: REPOS — grid layout, filters, multi-select ══ */}
        <div>
          <SectionLabel title="Example 3 — Repositories" sub="layout=grid · filters · multi-select · sortable" />
          <AdvancedList
            items={REPOS}
            getItemId={(r) => r.id}
            searchable
            searchPlaceholder="Find a repository…"
            searchKeys={["name", "lang"]}
            selectable
            mode="multi"
            selectedIds={selRepos}
            onSelectMany={(rs) => setSelRepos(rs.map((r) => r.id))}
            sortable
            sortOptions={[
              { key: "stars", label: "Stars" },
              { key: "forks", label: "Forks" },
              { key: "name", label: "Name" },
            ]}
            getSortValue={(r, k) => r[k]}
            defaultSortKey="stars"
            defaultSortDir="desc"
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "all", label: "All" },
                  { value: "active", label: "Active", count: REPOS.filter((r) => r.status === "active").length },
                  { value: "archived", label: "Archived", count: REPOS.filter((r) => r.status === "archived").length },
                ],
              },
              {
                key: "lang",
                label: "Language",
                options: [
                  { value: "all", label: "All" },
                  { value: "TypeScript", label: "TypeScript" },
                  { value: "Go", label: "Go" },
                  { value: "Python", label: "Python" },
                  { value: "React", label: "React" },
                  { value: "React Native", label: "Native" },
                ],
              },
            ]}
            layout="grid"
            gridCols="grid-cols-1 sm:grid-cols-2"
            maxHeight="max-h-[600px]"
            renderItem={(repo, ctx) => {
              const sel = ctx.isSelected(repo);
              return (
                <div
                  key={repo.id}
                  onClick={() => ctx.handleSelect(repo)}
                  className={`flex flex-col gap-3 p-4 border border-white/[0.05] m-1.5 rounded-xl cursor-pointer transition-all
                    ${sel ? "bg-emerald-500/[0.08] border-emerald-500/25" : "bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.10]"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold font-mono truncate ${sel ? "text-white" : "text-white/75"}`}>
                        {highlight(repo.name, ctx.query)}
                      </p>
                      <p className="text-white/25 text-xs mt-0.5">{repo.updated}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
                      ${sel ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}
                    >
                      {sel && (
                        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                          <path
                            d="M1.5 5l2.5 2.5 4.5-4.5"
                            stroke="white"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${langColor[repo.lang] ?? "bg-white/[0.07] text-white/45"}`}
                    >
                      {repo.lang}
                    </span>
                    {repo.status === "archived" && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-white/35">
                        archived
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-2 text-white/30 text-xs">
                      <span>⭐ {repo.stars}</span>
                      <span>⑂ {repo.forks}</span>
                    </span>
                  </div>
                </div>
              );
            }}
            renderFooter={(ctx) =>
              ctx.selectedCount > 0 && (
                <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-white/35 text-xs">
                    <span className="text-emerald-400 font-semibold">{ctx.selectedCount}</span> repos selected
                  </span>
                  <button
                    onClick={() => setSelRepos([])}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────
export const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@finvault.io",
    role: "Admin",
    dept: "Engineering",
    status: "online",
    avatar: null,
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@finvault.io",
    role: "Agent",
    dept: "Product",
    status: "busy",
    avatar: null,
  },
  {
    id: 3,
    name: "Alice Wang",
    email: "alice@finvault.io",
    role: "User",
    dept: "Design",
    status: "away",
    avatar: null,
  },
  {
    id: 4,
    name: "Bob Martinez",
    email: "bob@finvault.io",
    role: "Agent",
    dept: "Engineering",
    status: "offline",
    avatar: null,
  },
  {
    id: 5,
    name: "Clara Kent",
    email: "clara@finvault.io",
    role: "Admin",
    dept: "Finance",
    status: "online",
    avatar: null,
  },
  {
    id: 6,
    name: "Dev Patel",
    email: "dev@finvault.io",
    role: "User",
    dept: "Marketing",
    status: "online",
    avatar: null,
  },
  {
    id: 7,
    name: "Eva Chen",
    email: "eva@finvault.io",
    role: "Owner",
    dept: "Leadership",
    status: "online",
    avatar: null,
  },
  {
    id: 8,
    name: "Frank Müller",
    email: "frank@finvault.io",
    role: "Agent",
    dept: "Engineering",
    status: "busy",
    avatar: null,
  },
];

// ── Helpers ───────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const statusDot = {
  online: "bg-emerald-400",
  busy: "bg-amber-400",
  away: "bg-orange-400",
  offline: "bg-white/20",
};

export const roleStyle = {
  ADMIN: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  AGENT: "bg-amber-500/10  text-amber-400  border-amber-500/20",
  STUDENT: "bg-blue-500/10   text-blue-400   border-blue-500/20",
  USER: "bg-white/[0.07]  text-white/45   border-white/[0.08]",
};

export const KYC_STATUS_STYLE = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PENDING: "bg-amber-500/10  text-amber-400  border-amber-500/20",
  COMPLETED: "bg-blue-500/10   text-blue-400   border-blue-500/20",
  USER: "bg-white/[0.07]  text-white/45   border-white/[0.08]",
};

// ─────────────────────────────────────────────────────────────
// EXAMPLE: Single selection
// ─────────────────────────────────────────────────────────────
export function SingleSelectExample() {
  // ── The only state you need ───────────────────────────────
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col gap-5">
        {/* Page title */}
        <div>
          <h1 className="text-white text-xl font-semibold tracking-tight">Assign to Member</h1>
          <p className="text-white/35 text-sm mt-0.5">Select one team member to assign this task.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          {/* ── AdvancedList single-select ── */}
          <AdvancedList
            // --- data ---
            items={TEAM_MEMBERS}
            getItemId={(user) => user.id}
            // --- search ---
            searchable
            searchPlaceholder="Search members…"
            searchKeys={["name", "email", "dept"]}
            // --- selection ---
            selectable
            mode="single" // ← single select
            selectedId={selectedUser?.id ?? null} // ← controlled: current ID
            onSelect={(user) => {
              // clicking the already-selected user deselects them
              setSelectedUser((prev) => (prev?.id === user.id ? null : user));
            }}
            // --- optional filters ---
            filters={[
              {
                key: "role",
                label: "Role",
                options: [
                  { value: "all", label: "All" },
                  { value: "Admin", label: "Admin", count: 2 },
                  { value: "Agent", label: "Agent", count: 3 },
                  { value: "User", label: "User", count: 2 },
                ],
              },
            ]}
            // --- row render ---
            renderItem={(user, ctx) => {
              const selected = ctx.isSelected(user);
              return (
                <div
                  key={user.id}
                  onClick={() => ctx.handleSelect(user)}
                  className={[
                    "flex items-center gap-3 px-4 py-3",
                    "border-b border-white/[0.04] last:border-0",
                    "cursor-pointer transition-all duration-150",
                    selected ? "bg-emerald-500/[0.08]" : "hover:bg-white/[0.035]",
                  ].join(" ")}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-xs font-semibold text-white ring-2 ring-white/[0.06]">
                      {getInitials(user.name)}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0f1117] ${statusDot[user.status]}`}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate transition-colors ${selected ? "text-white" : "text-white/75"}`}
                    >
                      {highlight(user.name, ctx.query)}
                    </p>
                    <p className="text-xs text-white/30 truncate">
                      {highlight(user.email, ctx.query)}
                      <span className="text-white/20"> · {user.dept}</span>
                    </p>
                  </div>

                  {/* Role badge */}
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${roleStyle[user.role] ?? roleStyle.User}`}
                  >
                    {user.role}
                  </span>

                  {/* Selected checkmark */}
                  {selected && (
                    <svg
                      viewBox="0 0 16 16"
                      className="w-4 h-4 text-emerald-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5L13 4" />
                    </svg>
                  )}
                </div>
              );
            }}
            // --- footer: clear button when someone is selected ---
            renderFooter={() =>
              selectedUser && (
                <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-white/30 text-xs">1 member selected</span>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    ✕ Clear
                  </button>
                </div>
              )
            }
            maxHeight="max-h-[380px]"
          />

          {/* ── Selected user card ── */}
          <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-white/45 text-xs font-semibold uppercase tracking-wider">Selected assignee</p>
            </div>

            {selectedUser ? (
              <div className="px-5 py-5 flex flex-col gap-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/[0.08]">
                      {getInitials(selectedUser.name)}
                    </div>
                    <span
                      className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-[#0f1117] ${statusDot[selectedUser.status]}`}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[15px]">{selectedUser.name}</p>
                    <p className="text-white/35 text-xs mt-0.5">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-white/[0.03] rounded-xl border border-white/[0.05] divide-y divide-white/[0.04]">
                  {[
                    [
                      "Role",
                      <span
                        className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full border ${roleStyle[selectedUser.role]}`}
                      >
                        {selectedUser.role}
                      </span>,
                    ],
                    ["Department", selectedUser.dept],
                    ["Status", <span className="capitalize text-white/60">{selectedUser.status}</span>],
                    ["ID", <span className="font-mono text-white/50">#{selectedUser.id}</span>],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-white/35 text-sm">{label}</span>
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Confirm button */}
                <button
                  onClick={() => alert(`Assigned to ${selectedUser.name}`)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
                >
                  Confirm Assignment →
                </button>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-2 rounded-xl text-white/35 hover:text-white/60 text-sm transition-colors"
                >
                  Clear selection
                </button>
              </div>
            ) : (
              <div className="px-5 py-12 flex flex-col items-center text-center gap-2">
                <span className="text-3xl opacity-10">👤</span>
                <p className="text-white/25 text-sm">No one selected yet</p>
                <p className="text-white/15 text-xs">Pick a member from the list</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
