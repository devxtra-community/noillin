"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";

export default function AuthInitializer() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const prependNotification = useNotificationStore((state) => state.prependNotification);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentRole = useAuthStore.getState().user?.role;
        const response = await api.post("/auth/refresh", { role: currentRole });

        const { accessToken, user } = response.data.data;

        setAuth(accessToken, user);

        // Trigger web push subscription quietly in the background
        import("@/lib/web-push").then(({ subscribeUser }) => {
          subscribeUser();
        });
      } catch {
        clearAuth();
      }
    };

    restoreSession();
  }, [setAuth, clearAuth]);

  // Setup global socket for realtime notifications
  useEffect(() => {
    if (!user?.id) return;

    const socket = io("http://localhost:6001", {
      auth: { userId: user.id },
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Global socket connected ✅");
    });

    socket.on("notification:new", (notification) => {
      console.log("New realtime notification received:", notification);
      prependNotification(notification);
    });

    return () => {
      console.log("Disconnecting global socket...");
      socket.disconnect();
    };
  }, [user?.id, prependNotification]);

  return null;
}
