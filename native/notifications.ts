// native/notifications.ts
import { Platform, PermissionsAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';

export async function initNotifications() {
  // 🔹 Android 13+ permission
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }

  // 🔹 Create notification channel (MANDATORY)
  PushNotification.createChannel(
    {
      channelId: 'default',
      channelName: 'Default Notifications',
      channelDescription: 'App notifications',
      importance: 4, // HIGH
      vibrate: true,
    },
    () => {}
  );

  // 🔹 Configure notifications
  PushNotification.configure({
    onNotification: notification => {
      // Required for iOS
      notification.finish?.();
    },
    requestPermissions: Platform.OS === 'ios',
  });
}

export function scheduleLocalNotification(
  id: string,
  title: string,
  message: string,
  date: Date
) {
  PushNotification.localNotificationSchedule({
    channelId: 'default',
    id,
    title,
    message,
    date,
    allowWhileIdle: true,
  });
}
