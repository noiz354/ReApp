import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { authService } from '../../services/authService';
import { RegisterDto, ApiErrorResponse } from '../../types/auth';

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [form, setForm] = useState<RegisterDto>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Helper to update form state
  const updateForm = (key: keyof RegisterDto, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const { name, email, password, password_confirmation } = form;

    // Edge Case: Basic Client-side Validation
    if (!name || !email || !password || !password_confirmation) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (password !== password_confirmation) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(form);
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      // Edge Case: Handle Laravel-style validation errors
      const errorData = error.response?.data as ApiErrorResponse;
      
      if (errorData?.errors) {
        // Flatten and join multiple error messages (e.g., email already taken)
        const messages = Object.values(errorData.errors).flat().join('\n');
        Alert.alert('Registration Failed', messages);
      } else {
        Alert.alert('Registration Failed', errorData?.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput 
          placeholder="Full Name" 
          style={styles.input} 
          value={form.name}
          onChangeText={(v) => updateForm('name', v)}
          editable={!isLoading}
        />
        <TextInput 
          placeholder="Email Address" 
          style={styles.input} 
          value={form.email}
          onChangeText={(v) => updateForm('email', v)}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        <TextInput 
          placeholder="Password" 
          secureTextEntry 
          style={styles.input} 
          value={form.password}
          onChangeText={(v) => updateForm('password', v)}
          editable={!isLoading}
        />
        <TextInput 
          placeholder="Confirm Password" 
          secureTextEntry 
          style={styles.input} 
          value={form.password_confirmation}
          onChangeText={(v) => updateForm('password_confirmation', v)}
          editable={!isLoading}
        />

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Create Account" onPress={handleRegister} />
          )}
        </View>

        <Button 
          title="Back to Login" 
          onPress={() => navigation.goBack()} 
          color="#666"
          disabled={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 16, paddingVertical: 8, fontSize: 16 },
  buttonContainer: { marginTop: 20, marginBottom: 12 }
});