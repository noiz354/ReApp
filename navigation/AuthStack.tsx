import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();


export default function RootNavigator() {
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  // This function must be passed down to Onboarding
  const handleSetOnboarded = async () => {
    await AsyncStorage.setItem('onboarded', 'true');
    setOnboarded(true); // This update triggers the re-render to show <AuthStack />
  };

  if (onboarded === null) return null; // Or a splash screen

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboarded ? (
        // Pass the function here
        <Stack.Screen name="Onboarding">
          {(props) => <OnboardingScreen {...props} onFinish={handleSetOnboarded} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}