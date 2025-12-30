import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { ApiErrorResponse } from '../../types/auth';

export default function LoginScreen({ navigation, setOnboarded }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      
      setToken(data.access_token);
      
      if (typeof setOnboarded === 'function') {
        await setOnboarded();
      }
      
      navigation.replace('Main');
    } catch (e: any) {
const errorData = e.response?.data as ApiErrorResponse;
  const message = errorData?.errors 
    ? Object.values(errorData.errors).flat().join('\n') 
    : errorData.message || 'An error occurred';
  Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword}
        editable={!loading}
      />
      
      <View style={{ marginTop: 12 }}>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      </View>

      <Button 
        title="Go to Register" 
        onPress={() => navigation.navigate('Register')} 
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 12, paddingVertical: 8 },
});