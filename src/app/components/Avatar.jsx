import { getInitials } from "@/lib/utils";
import { statusColor } from "./UserList";

// ─────────────────────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────────────────────

export const Avatar = ({ user, size = "md" }) => {
  const sz = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  }[size];
  return (
    <div className="relative shrink-0">
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className={`${sz} rounded-full object-cover ring-2 ring-white/[0.06]`} />
      ) : (
        <div
          className={`${sz} rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center font-semibold text-primary ring-2 ring-white/[0.06]`}
        >
          {getInitials(user.name)}
        </div>
      )}
      {user.status && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0f1117] ${statusColor[user.status] ?? "bg-white/20"}`}
        />
      )}
    </div>
  );
};
