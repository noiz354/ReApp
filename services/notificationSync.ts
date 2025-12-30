// src/services/notificationSync.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

const API_URL = 'https://your-api.com/notifications';

type RemoteNotification = {
  id: string;
  title: string;
  body: string;
  fireAt: string; // ISO-8601 UTC
};

export async function pullAndScheduleNotifications() {
  const lastSync =
    (await AsyncStorage.getItem('lastNotificationSync')) ??
    '1970-01-01T00:00:00Z';

  try {
    const res = await fetch(`${API_URL}?since=${lastSync}`);
    if (!res.ok) {
        console.error('Failed to fetch notifications');
        return;
    }

    const notifications: RemoteNotification[] = await res.json();

    for (const n of notifications) {
      const scheduledKey = `notif_scheduled_${n.id}`;
      const alreadyScheduled = await AsyncStorage.getItem(scheduledKey);
      
      // Skip if we have already scheduled this ID
      if (alreadyScheduled) continue;

      const fireDate = new Date(n.fireAt);
      const now = Date.now();

      // ⚠️ Critical Notifee Check:
      // Triggers must be in the future. If the API returns a past date,
      // we should either show it immediately or ignore it. 
      // Here, we ignore it to prevent the app from crashing on invalid triggers.
      if (fireDate.getTime() <= now) {
        console.warn(`Skipping notification ${n.id} because fireAt is in the past.`);
        continue;
      }

      // 🔹 Create the Trigger
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: fireDate.getTime(), 
        alarmManager: true, // Replaces 'allowWhileIdle: true'
      };

      // 🔹 Schedule the Notification
      await notifee.createTriggerNotification(
        {
          id: n.id,
          title: n.title,
          body: n.body,
          android: {
            channelId: 'default', // Ensure this matches what you created in initNotifications()
            pressAction: {
              id: 'default',
            },
          },
        },
        trigger
      );

      // Mark as scheduled
      await AsyncStorage.setItem(scheduledKey, '1');
    }

    // Update sync time
    await AsyncStorage.setItem(
      'lastNotificationSync',
      new Date().toISOString()
    );
    
  } catch (error) {
    console.error('Error in notification sync:', error);
  }
}