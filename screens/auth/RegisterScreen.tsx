import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { 
  Text, 
  Checkbox, 
  IconButton, 
  ActivityIndicator,
  Portal,
  Dialog 
} from 'react-native-paper';
import { authService } from '../../services/authService';
import { RegisterDto, ApiErrorResponse } from '../../types/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState<RegisterDto>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (key: keyof RegisterDto, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await authService.register(form);
      Alert.alert('Success', 'Account created!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      const errorData = error.response?.data as ApiErrorResponse;
      Alert.alert('Error', errorData?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* A. Header: Centered Title + Left Back Arrow */}
        <View style={styles.header}>
          <IconButton 
            icon="arrow-left" 
            size={24} 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          />
          <Text variant="titleLarge" style={styles.headerTitle}>Sign Up</Text>
          <View style={{ width: 48 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formArea}>
            {/* B. Input Fields: Mint background, rounded corners */}
            <TextInput
              placeholder="Email / Phone"
              placeholderTextColor="#6b8f71"
              style={styles.customInput}
              value={form.email}
              onChangeText={(v) => updateForm('email', v)}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6b8f71"
              secureTextEntry
              style={styles.customInput}
              value={form.password}
              onChangeText={(v) => updateForm('password', v)}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#6b8f71"
              secureTextEntry
              style={styles.customInput}
              value={form.password_confirmation}
              onChangeText={(v) => updateForm('password_confirmation', v)}
            />

            {/* C. Consent: Paper Checkbox + Styled Links */}
            <View style={styles.consentRow}>
              <Checkbox.Android
                status={agree ? 'checked' : 'unchecked'}
                onPress={() => setAgree(!agree)}
                color="#2ee66b"
                uncheckedColor="#cfd8d3"
              />
              <Text style={styles.consentText}>
                I agree to the <Text style={styles.link}>Terms of Service</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>

            {/* D. Sign Up Button: Pill shape, Bright Green */}
            <TouchableOpacity
              style={[styles.primaryButton, { opacity: (agree && !isLoading) ? 1 : 0.6 }]}
              disabled={!agree || isLoading}
              onPress={handleRegister}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* E. Footer: Bottom centered link */}
        <TouchableOpacity 
          style={styles.footer} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  headerTitle: { fontWeight: '700', color: '#000' },
  backButton: { marginLeft: 8 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 30 },
  formArea: { flex: 1 },
  customInput: {
    backgroundColor: '#f1f6f2',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000',
    marginBottom: 18,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingRight: 20,
  },
  consentText: { fontSize: 13, color: '#000', lineHeight: 20 },
  link: { color: '#3f7f5f', textDecorationLine: 'underline' },
  primaryButton: {
    backgroundColor: '#2ee66b',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  footer: { paddingBottom: 30, alignItems: 'center' },
  footerText: { color: '#666' },
  footerLink: { color: '#3f7f5f', textDecorationLine: 'underline', fontWeight: '600' },
});