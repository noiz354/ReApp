// src/services/notificationApiService.ts
import apiClient from '../api/apiClient';
import { ServerNotification } from '../types/notification';

export const notificationApiService = {
  /**
   * GET /api/notifications/
   * Fetches notifications from the backend.
   */
  getNotifications: async (since?: string): Promise<ServerNotification[]> => {
    const url = since ? `/notifications/?since=${since}` : '/notifications/';
    const response = await apiClient.get<ServerNotification[]>(url);
    return response.data;
  },

  /**
   * PATCH /api/notifications/:id/
   * Marks a notification as read based on the 'is_read' field in your image.
   */
  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/`, { is_read: true });
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/notifications/unread_count/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      throw error;
    }
  }


};