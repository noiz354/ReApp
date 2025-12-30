import apiClient from '../api/apiClient';
import * as Keychain from 'react-native-keychain';
import { LoginDto, RegisterDto, AuthResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    await Keychain.setGenericPassword('session', JSON.stringify(data));
    return data;
  },

  register: async (details: RegisterDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', details);
    await Keychain.setGenericPassword('session', JSON.stringify(data));
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Edge Case: Always clear local storage even if the network call fails
      await Keychain.resetGenericPassword();
    }
  },
};