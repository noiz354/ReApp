import React from 'react';
import { View, TextInput, Button } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={{ padding: 24 }}>
      <TextInput placeholder="Email or Phone" style={{ borderBottomWidth: 1 }} />
      <TextInput placeholder="Password / OTP" secureTextEntry />
      <Button title="Login" />
      <Button title="Login with Biometrics" />
    </View>
  );
}