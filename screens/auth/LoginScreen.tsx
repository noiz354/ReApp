import React, { useState } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { theme as customTheme } from '../../theme';

// Custom components
import { BearAvatar } from '../../components/BearAvatar';
import { useBearLoginAnimation } from '../../hooks/useBearLoginAnimation';

export default function LoginScreen({ navigation, setOnboarded }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setToken } = useAuth();
  const { currentImage, handleEmailChange, triggerHideEyes } = useBearLoginAnimation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter credentials');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login({ username, password });
      setToken(data.access_token);
      if (typeof setOnboarded === 'function') await setOnboarded();
      navigation.replace('Main');
    } catch (e: any) {
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: customTheme.colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Fixed height container for Bear to prevent layout jumps */}
        <View style={styles.bearWrapper}>
          <BearAvatar imageSource={currentImage} />
        </View>

        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <TextInput 
          label="Email" 
          mode="outlined"
          value={username} 
          onChangeText={(text) => {
            setUsername(text);
            handleEmailChange(text.length);
          }}
          onFocus={() => triggerHideEyes(false)}
          autoCapitalize="none"
          outlineColor={customTheme.colors.primary}
          activeOutlineColor={customTheme.colors.secondary}
          style={styles.input}
        />
        
        <TextInput 
          label="Password" 
          mode="outlined"
          secureTextEntry={!showPassword} 
          value={password} 
          onChangeText={setPassword}
          onFocus={() => triggerHideEyes(true, showPassword)}
          onBlur={() => triggerHideEyes(false)}
          outlineColor={customTheme.colors.primary}
          activeOutlineColor={customTheme.colors.secondary}
          style={styles.input}
          right={
            <TextInput.Icon 
              icon={showPassword ? "eye-off" : "eye"} 
              onPress={() => {
                const newShow = !showPassword;
                setShowPassword(newShow);
                triggerHideEyes(true, newShow);
              }}
            />
          }
        />
        
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={customTheme.colors.secondary} />
          ) : (
            <Button 
              mode="contained"
              onPress={handleLogin}
              style={[styles.button, { backgroundColor: customTheme.colors.primary }]}
            >
              Login
            </Button>
          )}
        </View>

        <Button 
          mode="text"
          onPress={() => navigation.navigate('Register')} 
          textColor={customTheme.colors.secondary}
        >
          Don't have an account? Register
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  bearWrapper: { height: 160, alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { color: customTheme.colors.primary, fontWeight: 'bold' },
  subtitle: { color: '#666' },
  input: { marginBottom: 16 },
  buttonContainer: { marginTop: 12, marginBottom: 8 },
  button: { paddingVertical: 6, borderRadius: 8 },
});