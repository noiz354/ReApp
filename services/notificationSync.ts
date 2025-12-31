// src/services/notificationSync.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import { notificationApiService } from './notificationApiService';
import { ServerNotification } from '../types/notification';

export async function pullAndScheduleNotifications() {
  const lastSync =
    (await AsyncStorage.getItem('lastNotificationSync')) ??
    '1970-01-01T00:00:00Z';

  try {
    // UPDATED: Use the service instead of local fetch
    const notifications: ServerNotification[] = await notificationApiService.getNotifications(lastSync);

    for (const n of notifications) {
      const scheduledKey = `notif_scheduled_${n.id}`;
      const alreadyScheduled = await AsyncStorage.getItem(scheduledKey);
      
      if (alreadyScheduled) continue;

      // Mapping fields from Image A: 'created_at' replaces 'fireAt'
      const fireDate = new Date(n.created_at);
      const now = Date.now();

      if (fireDate.getTime() <= now) {
        console.warn(`Skipping notification ${n.id} because it is in the past.`);
        continue;
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: fireDate.getTime(), 
        alarmManager: true,
      };

      // Mapping fields from Image A: 'verb' as title, 'description' as body
      await notifee.createTriggerNotification(
        {
          id: n.id,
          title: n.verb,
          body: n.description,
          android: {
            channelId: 'default',
            pressAction: {
              id: 'default',
            },
          },
        },
        trigger
      );

      await AsyncStorage.setItem(scheduledKey, '1');
    }

    await AsyncStorage.setItem(
      'lastNotificationSync',
      new Date().toISOString()
    );
    
  } catch (error) {
    console.error('Error in notification sync:', error);
  }
}