import { create } from 'zustand';

import api from '@/lib/axios.client';

interface DashboardCounts {
  unreadMessagesCount: number;
  pendingRequestsCount: number;
}

interface DashboardStore {
  counts: DashboardCounts;
  loading: boolean;
  fetchCounts: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  counts: {
    unreadMessagesCount: 0,
    pendingRequestsCount: 0,
  },
  loading: false,

  fetchCounts: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/users/counts');
      if (response.data.success) {
        set({ counts: response.data.data, loading: false });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard counts:', error);
      set({ loading: false });
    }
  },
}));
