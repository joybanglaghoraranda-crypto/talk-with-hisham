'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function Providers({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const loadFromStorage = useNotificationStore((s) => s.loadFromStorage);
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);

  // Initialize auth on mount
  useEffect(() => {
    initialize();
    loadFromStorage();
  }, [initialize, loadFromStorage]);

  // Listen for private message replies (realtime notifications)
  useEffect(() => {
    if (!user) return;

    const supabase = getSupabaseClient();
    const channel = supabase
      .channel('notification_replies')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'private_messages',
          filter: `sender_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as any;
          if (updated.admin_reply && !payload.old?.admin_reply) {
            addNotification({
              type: 'message_reply',
              title: 'Hisham replied!',
              body: updated.admin_reply.substring(0, 100) + (updated.admin_reply.length > 100 ? '...' : ''),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, addNotification]);

  return <>{children}</>;
}
