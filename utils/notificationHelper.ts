import { notificationService } from '../services/notificationService';

export const pullAndScheduleNotifications = async () => {
  try {
    // Request permission first (especially for Android 13+)
    const hasPermission = await notificationService.requestUserPermission();
    
    if (hasPermission) {
      // Simulate fetching a notification from your MachineSiteLearning API
      await notificationService.displayLocalNotification(
        'Welcome Back!',
        'You have successfully logged into your account.'
      );
    }
  } catch (error) {
    console.error('Notification Error:', error);
  }
};