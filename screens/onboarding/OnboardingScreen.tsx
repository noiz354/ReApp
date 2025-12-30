// src/screens/onboarding/OnboardingScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { Button, Text } from 'react-native-paper';
import { onboardingAnim } from '../../utils/animations';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OnboardingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <LottieView
        source={onboardingAnim}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text variant="headlineLarge" style={styles.title}>
        Shop Smarter
      </Text>

      <Text style={styles.subtitle}>
        Secure Payments · Fast Delivery · Live Video Shopping
      </Text>

      <Button
        mode="contained"
        icon={() => <Icon name="arrow-forward-circle" size={24} color="white" />}
        onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
        style={styles.button}
      >
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 32, flex: 1, justifyContent: 'center' },
  lottie: { height: 250 },
  title: { marginTop: 24, textAlign: 'center' },
  subtitle: { textAlign: 'center', marginVertical: 12 },
  button: { marginTop: 24 },
});
