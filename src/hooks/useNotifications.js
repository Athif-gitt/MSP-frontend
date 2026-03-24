import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { notificationSocket } from '../services/socket';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const queryKey = NOTIFICATIONS_QUERY_KEY;

  // 1. Fetch notifications
  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: notificationService.fetchNotifications,
    // Provide a default structure to avoid undefined errors
    initialData: { count: 0, results: [] },
  });

  // 2. Mark as read mutation (Optimistic update)
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, (old) => {
        if (!old || !old.results) return old;
        return {
          ...old,
          results: old.results.map((notif) =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          ),
        };
      });

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      // Revert to snapshot on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKey, context.previousNotifications);
      }
    },
    // No need to invalidate on success because optimistic update handles it,
    // unless we want to ensure full sync. We'll rely on the optimistic update to be fast.
  });

  // 3. WebSocket Integration for real-time updates
  useEffect(() => {
    // Connect the socket (if already connected, the socket class prevents duplicates)
    notificationSocket.connect();

    // Subscribe to incoming messages
    const unsubscribe = notificationSocket.subscribe((message) => {
      // Ensure the message has valid data
      if (!message || !message.id) return;

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return { count: 1, results: [message] };

        // Prevent duplicate notifications in the cache
        const exists = old.results?.some((notif) => notif.id === message.id);
        if (exists) return old;

        return {
          ...old,
          count: (old.count || 0) + 1,
          results: [message, ...(old.results || [])],
        };
      });
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      // Alternatively, we could do notificationSocket.disconnect()
      // if this hook is the only one using the connection.
      // But typically WebSockets live at the app root or we just disconnect when unmounted.
      // We'll disconnect for now as per requirements: "Clean up socket on unmount".
      notificationSocket.disconnect();
    };
  }, [queryClient, queryKey]);

  // Derived state to get unread count
  const unreadCount = data?.results?.filter((n) => !n.is_read).length || 0;

  return {
    notifications: data?.results || [],
    unreadCount,
    isLoading,
    isError,
    error,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
};
