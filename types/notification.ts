// src/types/notification.ts
export interface ServerNotification {
  id: string;
  verb: string;
  description: string;
  is_read: boolean;
  created_at: string;
  target_object_id: number;
}