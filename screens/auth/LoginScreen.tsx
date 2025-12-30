import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setOnboarded }: any) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();

  async function handleLogin() {
    // Simulate login request - replace with real API call
    try {
      // example: const res = await fetch('/web/auth/token/obtain/', ...)
      await new Promise(r => setTimeout(r, 600));
      const fakeToken = 'fake-jwt-token';
      setToken(fakeToken);
      await AsyncStorage.setItem('@token', fakeToken);
      if (typeof setOnboarded === 'function') await setOnboarded();
      navigation.navigate('Main');
    } catch (e) {
      Alert.alert('Login failed');
    }
  }

  return (
    <View style={{ padding: 24 }}>
      <TextInput placeholder="Email or Phone" style={{ borderBottomWidth: 1, marginBottom: 12 }} value={identifier} onChangeText={setIdentifier} />
      <TextInput placeholder="Password / OTP" secureTextEntry value={password} onChangeText={setPassword} />
      <View style={{ marginTop: 12 }}>
        <Button title="Login" onPress={handleLogin} />
      </View>
      <View style={{ marginTop: 8 }}>
        <Button title="Login with Biometrics" onPress={() => Alert.alert('Biometrics not configured')} />
      </View>
    </View>
  );
}