"use client";

import { AdvancedList, highlight, KYC_STATUS_STYLE, roleStyle } from "@/app/components/AdvanceList";
import { ListSkeleton } from "@/app/components/skeleton";
import { useStudents } from "@/hooks/useStudent";
import { getInitials } from "@/lib/utils";
import { useSendMoneyForm } from "@/store/form.store";
import { useState } from "react";

const SelectRemitter = () => {
  const { remitter, setUser, setRemitter } = useSendMoneyForm((s) => s);
  const { data, isLoading } = useStudents({
    query: {
      populate: "passport pan",
      size: 100,
      role: "STUDENT",
    },
  });

  const USERS_DATA = data?.content;

  const [selectedUser, setSelectedUser] = useState(null);

  const onConfirmRemitter = (user) => {
    if (!user) return;
    setUser(user);
    setRemitter(user);
  };

  if (isLoading) return <ListSkeleton />;

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 items-start">
        {/* ── AdvancedList single-select ── */}
        <div className="col-span-3">
          <AdvancedList
            // --- data ---
            items={USERS_DATA}
            getItemId={(user) => user._id}
            // --- search ---
            searchable
            searchPlaceholder="Search students.."
            searchKeys={["name", "email", "userId"]}
            // --- selection ---
            selectable
            mode="single" // ← single select
            selectedId={selectedUser?._id ?? null} // ← controlled: current ID
            onSelect={(user) => {
              // clicking the already-selected user deselects them
              setSelectedUser((prev) => (prev?._id === user._id ? null : user));
            }}
            // --- optional filters ---
            filters={[
              {
                key: "kycStatus",
                label: "Status",
                options: [{ value: "all", label: "All" }],
              },
            ]}
            // --- row render ---
            renderItem={(user, ctx) => {
              const selected = ctx.isSelected(user);
              return (
                <div
                  key={user._id}
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
                      {getInitials(`${user.firstName} ${user.lastName}`)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate transition-colors ${selected ? "text-white" : "text-white/75"}`}
                    >
                      {highlight(`${user.firstName} ${user.lastName}`, ctx.query)}
                    </p>
                    <p className="text-xs text-white/30 truncate">
                      {highlight(user.email, ctx.query)}
                      <span className="text-white/20"> · {user.dept}</span>
                    </p>
                  </div>

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
        </div>

        {/* ── Selected user card ── */}
        <div className="col-span-2 bg-[#0f1117] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <p className="text-white/45 text-xs font-semibold uppercase tracking-wider">Selected Remitter</p>
          </div>

          {selectedUser ? (
            <div className="px-5 py-5 flex flex-col gap-5">
              {/* Avatar + name */}
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/[0.08]">
                    {getInitials(`${selectedUser.firstName} ${selectedUser.lastName}`)}
                  </div>
                </div>
                <div>
                  <p className="text-white font-semibold text-[15px]">{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
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
                  ["User ID", selectedUser.userId],

                  [
                    "Passport Verfification",
                    <span
                      className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full border ${KYC_STATUS_STYLE[selectedUser?.passport?.verified ? "COMPLETED" : "PENDING"]}`}
                    >
                      {selectedUser?.passport?.verified ? "Verified" : "Pending"}
                    </span>,
                  ],
                  [
                    "PAN Verfification",
                    <span
                      className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full border ${KYC_STATUS_STYLE[selectedUser?.pan?.verified ? "COMPLETED" : "PENDING"]}`}
                    >
                      {selectedUser?.pan?.verified ? "Verified" : "Pending"}
                    </span>,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-white/35 text-sm">{label}</span>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>

              {/* Confirm button */}
              <button
                onClick={() => onConfirmRemitter(selectedUser)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                Confirm Remitter →
              </button>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  onConfirmRemitter(null);
                }}
                className="w-full py-2 rounded-xl text-white/35 hover:text-white/60 text-sm transition-colors cursor-pointer"
              >
                Clear Selection
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
  );
};

export default SelectRemitter;
