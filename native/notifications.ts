import notifee, { 
  TriggerType, 
  AndroidImportance, 
  TimestampTrigger,
  RepeatFrequency 
} from '@notifee/react-native';

export async function initNotifications() {
  // 🔹 Request permissions
  // Notifee handles Android 13+ (SDK 33) and iOS permissions automatically here.
  await notifee.requestPermission();

  // 🔹 Create notification channel (Android MANDATORY)
  await notifee.createChannel({
    id: 'default',
    name: 'Default Notifications',
    description: 'App notifications',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
  });
  
  console.log('Notifee: Notifications initialized');
}

export async function scheduleLocalNotification(
  id: string,
  title: string,
  message: string,
  date: Date
) {
  // 🔹 Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), // Requires Unix timestamp in milliseconds
    
    // 'alarmManager' is the equivalent of 'allowWhileIdle: true'
    // It allows the notification to fire even in Doze mode on Android.
    alarmManager: true, 
  };

  // 🔹 Schedule the notification
  await notifee.createTriggerNotification(
    {
      id: id,
      title: title,
      body: message,
      android: {
        channelId: 'default',
        // 'pressAction' is required if you want the app to open when pressed
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        // Optional: iOS specific sound/interruption levels
        sound: 'default',
      },
    },
    trigger
  );
}

// Helper: Cancel a specific notification
export async function cancelNotification(id: string) {
  await notifee.cancelNotification(id);
}