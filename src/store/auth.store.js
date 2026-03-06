"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      isHydrated: false, // track rehydration

      setAuth: (data) =>
        set({
          user: data.content.user,
          token: data.content.token,
          role: data.content.role,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          role: null,
        }),
    }),
    {
      name: "auth-storage",
      skipHydration: false,
    },
  ),
);
