import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "BRAND" | "INFLUENCER";
  adminLevel?: "SUPER" | "NORMAL" | null;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isInitialized: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  finishInitialization: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isInitialized: false,

      setAuth: (token, user) =>
        set({ accessToken: token, user, isInitialized: true }),

      clearAuth: () =>
        set({ accessToken: null, user: null, isInitialized: true }),

      finishInitialization: () =>
        set({ isInitialized: true })
    }),
    {
      name: "auth-storage",
    }
  )
);
