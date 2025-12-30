// src/services/notificationSync.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

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

  const res = await fetch(`${API_URL}?since=${lastSync}`);
  if (!res.ok) return;

  const notifications: RemoteNotification[] = await res.json();

  for (const n of notifications) {
    const scheduledKey = `notif_scheduled_${n.id}`;
    const alreadyScheduled = await AsyncStorage.getItem(scheduledKey);
    if (alreadyScheduled) continue;

    PushNotification.localNotificationSchedule({
      channelId: 'default',
      id: n.id,
      title: n.title,
      message: n.body,
      date: new Date(n.fireAt),
      allowWhileIdle: true,
    });

    await AsyncStorage.setItem(scheduledKey, '1');
  }

  await AsyncStorage.setItem(
    'lastNotificationSync',
    new Date().toISOString()
  );
}
