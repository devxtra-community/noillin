"use client";

import { useEffect } from "react";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";

export default function AuthInitializer() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.post("/auth/refresh");

        const { accessToken, user } = response.data.data;

        setAuth(accessToken, user);
      } catch {
        clearAuth();
      }
    };

    restoreSession();
  }, [setAuth, clearAuth]);

  return null;
}
