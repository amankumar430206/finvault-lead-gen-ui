// src/components/ThemeToggle.jsx
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl
        bg-card border  border-[var(--border-clr)] text-secondary
        hover:text-primary transition-all duration-200 text-sm font-medium"
    >
      {/* Sun icon */}
      <svg
        viewBox="0 0 25 25"
        className={`w-4 h-4 transition-all duration-300 ${isDark ? "opacity-40 scale-75" : "opacity-100 scale-100 text-amber-400"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>

      {/* Track */}
      <div
        className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${isDark ? "bg-accent" : "bg-black/10"}`}
      >
        <div
          className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm
          transition-all duration-300 ${isDark ? "left-5" : "left-0.5"}`}
        />
      </div>

      {/* Moon icon */}
      <svg
        viewBox="0 0 25 25"
        className={`w-4 h-4 transition-all duration-300 ${isDark ? "opacity-100 scale-100 text-accent" : "opacity-40 scale-75"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    </button>
  );
}
