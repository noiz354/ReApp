import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import * as Keychain from 'react-native-keychain';
import { CommonActions, useNavigation } from '@react-navigation/native';

export const useLogout = () => {
  const { setToken } = useAuth();
  const navigation = useNavigation();

  const logout = async () => {
    try {
      // 1. Attempt to invalidate session on server
      await authService.logout();
    } catch (error) {
      // Edge Case: Log the error but don't stop the local logout process
      console.warn('Server-side logout failed or timed out', error);
    } finally {
      // 2. Clear secure storage regardless of API success
      await Keychain.resetGenericPassword();

      // 3. Reset Global Context State
      setToken(null);

      // 4. Wipe Navigation Stack
      // This prevents the user from clicking 'Back' to return to protected screens
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }], // Replace 'Auth' with your Auth Stack name
        })
      );
    }
  };

  return { logout };
};