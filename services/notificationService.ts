import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  async requestUserPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled');
      return true;
    } else {
      console.log('User has notification permissions disabled');
      return false;
    }
  }

  async displayLocalNotification(title: string, body: string) {
    // 1. Create a channel (Required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // 2. Display the notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        // Optional: add a small icon (must exist in android/app/src/main/res/drawable)
        // smallIcon: 'ic_launcher', 
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}

export const notificationService = new NotificationService();