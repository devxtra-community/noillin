import { create } from 'zustand';

import api from '@/lib/axios.client';

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  type: "GIG_REQUEST" | "GIG_ACCEPTED" | "GIG_REJECTED" | "NEW_MESSAGE";
  metadata?: {
    connectionId?: string;
    gigRequestId?: string;
    conversationId?: string;
  };
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  prependNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  prependNotification: (notification) => {
  const { notifications, unreadCount } = get();

  // ✅ Normalize incoming data (VERY IMPORTANT)
  const normalized: Notification = {
    ...notification,
    read: notification.read ?? false,
    metadata: notification.metadata || {},
  };

  // ✅ Prevent duplicates
  if (notifications.some(n => n._id === normalized._id)) return;

  set({
    notifications: [normalized, ...notifications],
    unreadCount: unreadCount + (normalized.read ? 0 : 1),
  });
},

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/notifications/my');

const raw = response.data;

let notifications: Notification[] = [];

if (Array.isArray(raw)) {
  notifications = raw;
} else if (Array.isArray(raw?.data)) {
  notifications = raw.data;
} else if (Array.isArray(raw?.notifications)) {
  notifications = raw.notifications;
} else if (Array.isArray(raw?.data?.notifications)) {
  notifications = raw.data.notifications;
}

// const unreadCount = notifications.filter((n) => !n.read).length;
const normalized = notifications.map((n) => ({
  ...n,
  read: n.read ?? false,
  metadata: n.metadata || {},
}));

const unreadCountNormalized = normalized.filter((n) => !n.read).length;

set({
  notifications: normalized,
  unreadCount: unreadCountNormalized,
  loading: false,
});
      // const response = await api.get('/notifications/my');
      // // Handle different API response structures safely
      // const data: Notification[] = response.data?.data || response.data || [];

      // const unreadCount = data.filter((n) => !n.read).length;

      // set({ notifications: data, unreadCount, loading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    const { notifications } = get();

    // Optimistic update for UI responsiveness
    const updatedNotifications = notifications.map((n) =>
      n._id === id ? { ...n, read: true } : n
    );
    const unreadCount = updatedNotifications.filter((n) => !n.read).length;

    set({ notifications: updatedNotifications, unreadCount });

    try {
      // Assumes standard REST update endpoint, fallback if fails
      await api.patch(`/notifications/${id}/read`, { read: true });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert optimistic update on failure
      set({
        notifications,
        unreadCount: notifications.filter(n => !n.read).length
      });
    }
  }
}));
