import { getInitials } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "./Avatar";

// ─────────────────────────────────────────────────────────────
// TYPES (JSDoc for prop reference)
// ─────────────────────────────────────────────────────────────
/**
 * User shape:
 * {
 *   id:        string | number
 *   name:      string
 *   email:     string
 *   avatar?:   string          — image URL (falls back to initials)
 *   role?:     string          — e.g. "Admin", "Editor"
 *   status?:   "online" | "offline" | "busy" | "away"
 *   meta?:     string          — extra line of text (department, handle, etc.)
 *   disabled?: boolean         — greys out and prevents selection
 * }
 */

// ─────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────

export const statusColor = {
  online: "bg-accent",
  busy: "bg-amber-400",
  away: "bg-orange-400",
  offline: "bg-white/20",
};

const roleColor = {
  Admin: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Owner: "bg-amber-500/10  text-amber-400  border-amber-500/20",
  Editor: "bg-blue-500/10   text-blue-400   border-blue-500/20",
  Viewer: "bg-inputbg  text-primary/45    border-[var(--border-clr)]",
  default: "bg-inputbg  text-primary/45    border-[var(--border-clr)]",
};

const highlight = (text = "", query = "") => {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/25 text-emerald-300 rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SELECTED CHIP (multi-select)
// ─────────────────────────────────────────────────────────────
const SelectedChip = ({ user, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-accent/10 border border-emerald-500/25 text-accent text-xs font-medium">
    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-[8px] font-bold text-primary shrink-0">
      {getInitials(user.name)}
    </div>
    {user.name.split(" ")[0]}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRemove(user.id);
      }}
      className="opacity-60 hover:opacity-100 transition-opacity leading-none ml-0.5"
    >
      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="currentColor">
        <path d="M3 3l4 4M7 3L3 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </button>
  </span>
);

// ─────────────────────────────────────────────────────────────
// USER ROW
// ─────────────────────────────────────────────────────────────
const ListItem = ({ user, selected, onSelect, query, mode }) => {
  const isSelected = mode === "multi" ? selected.some((s) => s.id === user.id) : selected?.id === user.id;

  return (
    <button
      type="button"
      disabled={user.disabled}
      onClick={() => !user.disabled && onSelect(user)}
      className={[
        "w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left group",
        isSelected
          ? "bg-accent/[0.08]"
          : user.disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-inputbg cursor-pointer",
      ].join(" ")}
    >
      <Avatar user={user} />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium truncate ${
              isSelected ? "text-primary" : "text-primary/80 group-hover:text-primary"
            }`}
          >
            {highlight(user.name, query)}
          </span>
          {user.role && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${
                roleColor[user.role] ?? roleColor.default
              }`}
            >
              {user.role}
            </span>
          )}
        </div>
        <p className="text-xs text-primary/50 truncate mt-0.5">
          {highlight(user.email, query)}
          {user.meta && <span className="text-primary/20"> · {user.meta}</span>}
        </p>
      </div>

      {/* Right side */}
      <div className="shrink-0 ml-2 flex items-center gap-2">
        {/* Multi-select checkbox */}
        {mode === "multi" && (
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
            ${isSelected ? "bg-accent border-emerald-500" : "border-white/20 group-hover:border-white/40"}`}
          >
            {isSelected && (
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

        {/* Single-select checkmark */}
        {mode === "single" && isSelected && (
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5L13 4" />
          </svg>
        )}
      </div>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// USER PICKER — main export
// ─────────────────────────────────────────────────────────────
/**
 * Props:
 *   users            User[]                  — full list of users to display
 *   onSelectUser     (user: User) => void     — called when a user is selected/deselected (single)
 *   onSelectUsers    (users: User[]) => void  — called on every change (multi)
 *   selectedUser     User | null              — controlled single-select value
 *   selectedUsers    User[]                   — controlled multi-select value
 *   mode             "single" | "multi"       — default: "single"
 *   placeholder      string                   — search input placeholder
 *   emptyText        string                   — shown when no results match
 *   maxHeight        string                   — tailwind class for list scroll area, default "max-h-72"
 *   showSearch       boolean                  — default: true
 *   groupByRole      boolean                  — group rows by role, default: false
 *   footer           ReactNode                — optional sticky footer below the list
 *   className        string                   — extra classes on root
 */
export const UserList = ({
  users = [],
  onSelectUser,
  onSelectUsers,
  selectedUser = null,
  selectedUsers = [],
  mode = "single",
  placeholder = "Search by name or email…",
  emptyText = "No users found",
  maxHeight = "max-h-72",
  showSearch = true,
  groupByRole = false,
  footer,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Auto-focus search on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q) ||
        u.meta?.toLowerCase().includes(q),
    );
  }, [users, query]);

  const handleSelect = (user) => {
    if (mode === "single") {
      onSelectUser?.(user);
    } else {
      const already = selectedUsers.some((s) => s.id === user.id);
      const next = already ? selectedUsers.filter((s) => s.id !== user.id) : [...selectedUsers, user];
      onSelectUsers?.(next);
    }
  };

  const handleRemove = (id) => {
    if (mode === "multi") {
      onSelectUsers?.(selectedUsers.filter((s) => s.id !== id));
    } else {
      onSelectUser?.(null);
    }
  };

  // Optionally group by role
  const grouped = useMemo(() => {
    if (!groupByRole) return { "": filtered };
    return filtered.reduce((acc, u) => {
      const key = u.role ?? "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(u);
      return acc;
    }, {});
  }, [filtered, groupByRole]);

  const selectedCount = mode === "multi" ? selectedUsers.length : selectedUser ? 1 : 0;

  return (
    <div
      className={`flex flex-col bg-card rounded-2xl border  border-[var(--border-clr)] overflow-hidden ${className}`}
    >
      {/* ── Search header ── */}
      {showSearch && (
        <div className="px-4 py-3 border-b  border-[var(--border-clr)]">
          {/* Multi-select chips */}
          {mode === "multi" && selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {selectedUsers.map((u) => (
                <SelectedChip key={u.id} user={u} onRemove={handleRemove} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2.5 bg-inputbg border  border-[var(--border-clr)] rounded-xl px-3.5 py-2 focus-within:border-accent/50 transition-all">
            <svg
              viewBox="0 0 16 16"
              className="w-3.5 h-3.5 text-primary/70 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path strokeLinecap="round" d="M11 11l3 3" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-sm text-primary placeholder:text-primary/70"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-primary/70 hover:text-primary/60 transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── List ── */}
      <div className={`overflow-y-auto overscroll-contain ${maxHeight}`}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-6">
            <span className="text-2xl opacity-20">◎</span>
            <p className="text-primary/50 text-sm">{emptyText}</p>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-accent/70 hover:text-accent text-xs transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          Object.entries(grouped).map(([group, groupUsers]) => (
            <div key={group}>
              {groupByRole && group && (
                <div className="px-4 py-2 bg-inputbg border-b  border-[var(--border-clr)] flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      roleColor[group] ?? roleColor.default
                    }`}
                  >
                    {group}
                  </span>
                  <span className="text-primary/20 text-xs">{groupUsers.length}</span>
                </div>
              )}
              {groupUsers.map((user) => (
                <ListItem
                  key={user.id}
                  user={user}
                  selected={mode === "multi" ? selectedUsers : selectedUser}
                  onSelect={handleSelect}
                  query={query}
                  mode={mode}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* ── Footer ── */}
      {(footer || (mode === "multi" && selectedCount > 0)) && (
        <div className="border-t  border-[var(--border-clr)] bg-inputbg px-4 py-3 flex items-center justify-between gap-3">
          {mode === "multi" && selectedCount > 0 ? (
            <span className="text-primary/50 text-xs">
              <span className="text-accent font-semibold">{selectedCount}</span> selected
            </span>
          ) : (
            <span />
          )}
          {footer}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DEMO DATA
// ─────────────────────────────────────────────────────────────
const DEMO_USERS = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@finvault.io",
    role: "Admin",
    status: "online",
    meta: "Engineering",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@finvault.io",
    role: "Editor",
    status: "busy",
    meta: "Product",
  },
  {
    id: 3,
    name: "Alice Wang",
    email: "alice@finvault.io",
    role: "Viewer",
    status: "away",
    meta: "Design",
  },
  {
    id: 4,
    name: "Bob Martinez",
    email: "bob@finvault.io",
    role: "Editor",
    status: "offline",
    meta: "Engineering",
  },
  {
    id: 5,
    name: "Clara Kent",
    email: "clara@finvault.io",
    role: "Admin",
    status: "online",
    meta: "Finance",
  },
  {
    id: 6,
    name: "Dev Patel",
    email: "dev@finvault.io",
    role: "Viewer",
    status: "online",
    meta: "Marketing",
  },
  {
    id: 7,
    name: "Eva Chen",
    email: "eva@finvault.io",
    role: "Owner",
    status: "online",
    meta: "Leadership",
  },
  {
    id: 8,
    name: "Frank Müller",
    email: "frank@finvault.io",
    role: "Editor",
    status: "busy",
    meta: "Engineering",
  },
  {
    id: 9,
    name: "Grace Lee",
    email: "grace@finvault.io",
    role: "Viewer",
    status: "offline",
    meta: "Support",
  },
  {
    id: 10,
    name: "Hassan Tariq",
    email: "hassan@finvault.io",
    role: "Viewer",
    status: "online",
    meta: "Sales",
  },
  {
    id: 11,
    name: "Isabelle Roy",
    email: "isabelle@finvault.io",
    role: "Editor",
    status: "away",
    meta: "Design",
  },
  {
    id: 12,
    name: "James O'Brien",
    email: "james@finvault.io",
    role: "Viewer",
    status: "offline",
    meta: "Legal",
    disabled: true,
  },
];

// ─────────────────────────────────────────────────────────────
// DEMO PAGE
// ─────────────────────────────────────────────────────────────
export default function UserListDemo() {
  const [singleUser, setSingleUser] = useState(null);
  const [multiUsers, setMultiUsers] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);

  return (
    <div className="min-h-screen bg-base p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-primary font-bold text-sm shadow-md shadow-emerald-500/30">
            F
          </div>
          <h1 className="text-primary text-2xl font-semibold tracking-tight">UserList</h1>
          <span className="text-xs font-medium bg-inputbg text-primary/75 px-2 py-0.5 rounded-full">Component</span>
        </div>
        <p className="text-primary/50 text-sm ml-12">
          Searchable user list · single & multi-select · role grouping · highlight
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-6xl">
        {/* ── Single Select ── */}
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-primary font-semibold text-sm mb-0.5">Single Select</h2>
            <p className="text-primary/50 text-xs">mode="single" · click to select one user</p>
          </div>

          {/* Result */}
          <div className="bg-card2 border  border-[var(--border-clr)] rounded-xl px-4 py-3 min-h-[56px] flex items-center">
            {singleUser ? (
              <div className="flex items-center gap-2.5 w-full">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {getInitials(singleUser.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-primary text-sm font-medium truncate">{singleUser.name}</p>
                  <p className="text-primary/50 text-xs truncate">{singleUser.email}</p>
                </div>
                <button
                  onClick={() => setSingleUser(null)}
                  className="text-primary/70 hover:text-primary/60 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <p className="text-primary/20 text-sm">No user selected</p>
            )}
          </div>

          <UserList
            users={DEMO_USERS}
            mode="single"
            selectedUser={singleUser}
            onSelectUser={setSingleUser}
            placeholder="Search members…"
          />
        </div>

        {/* ── Multi Select ── */}
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-primary font-semibold text-sm mb-0.5">Multi Select</h2>
            <p className="text-primary/50 text-xs">mode="multi" · chips above search</p>
          </div>

          <UserList
            users={DEMO_USERS}
            mode="multi"
            selectedUsers={multiUsers}
            onSelectUsers={setMultiUsers}
            placeholder="Add team members…"
            footer={
              multiUsers.length > 0 && (
                <button
                  onClick={() => setMultiUsers([])}
                  className="text-xs text-primary/50 hover:text-primary/60 transition-colors"
                >
                  Clear all
                </button>
              )
            }
          />

          {/* Result */}
          <div className="bg-card2 border  border-[var(--border-clr)] rounded-xl px-4 py-3 min-h-[56px]">
            {multiUsers.length > 0 ? (
              <div>
                <p className="text-primary/50 text-xs mb-2">
                  <span className="text-accent font-semibold">{multiUsers.length}</span> member
                  {multiUsers.length !== 1 ? "s" : ""} selected
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {multiUsers.map((u) => (
                    <span
                      key={u.id}
                      className="text-xs bg-inputbg text-primary/75 border  border-[var(--border-clr)] px-2 py-0.5 rounded-full"
                    >
                      {u.name.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-primary/20 text-sm">No users selected</p>
            )}
          </div>
        </div>

        {/* ── Grouped by Role ── */}
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-primary font-semibold text-sm mb-0.5">Grouped by Role</h2>
            <p className="text-primary/50 text-xs">groupByRole=true · mode="multi"</p>
          </div>

          <UserList
            users={DEMO_USERS}
            mode="multi"
            groupByRole
            selectedUsers={groupUsers}
            onSelectUsers={setGroupUsers}
            placeholder="Search all roles…"
            maxHeight="max-h-80"
          />
        </div>
      </div>
    </div>
  );
}
