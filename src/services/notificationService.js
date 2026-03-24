import api from './api';

export const notificationService = {
  /**
   * Fetch paginated notifications for the current user.
   * Expected response shape: { count: number, next: string, previous: string, results: any[] }
   */
  fetchNotifications: async () => {
    const response = await api.get('/notifications/');
    return response.data;
  },

  /**
   * Mark a specific notification as read.
   * @param {string|number} notificationId 
   */
  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/mark_as_read/`);
    return response.data;
  }
};
