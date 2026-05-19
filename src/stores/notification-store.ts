'use client';

import { create } from 'zustand';
import type { Notification } from '@/lib/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (notif: Omit<Notification, 'id' | 'read' | 'created_at'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  loadFromStorage: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notif) => {
    const newNotif: Notification = {
      ...notif,
      id: crypto.randomUUID(),
      read: false,
      created_at: new Date().toISOString(),
    };
    const updated = [newNotif, ...get().notifications].slice(0, 50);
    set({ notifications: updated, unreadCount: updated.filter((n) => !n.read).length });
    persistNotifications(updated);
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    set({ notifications: updated, unreadCount: updated.filter((n) => !n.read).length });
    persistNotifications(updated);
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
    persistNotifications(updated);
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
    persistNotifications([]);
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('twh-notifications');
      const notifications: Notification[] = stored ? JSON.parse(stored) : [];
      set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
    } catch {
      set({ notifications: [], unreadCount: 0 });
    }
  },
}));

function persistNotifications(notifications: Notification[]) {
  try {
    localStorage.setItem('twh-notifications', JSON.stringify(notifications));
  } catch {
    // localStorage might not be available
  }
}
