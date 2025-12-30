import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Keychain from 'react-native-keychain';
import { setLogoutHandler } from '../utils/authEmitter';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Register the global logout handler for Auto-Logout
    setLogoutHandler(() => {
      setToken(null);
    });

    // 2. Initial Boot: Check for existing session
    const initializeAuth = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          // Assuming the password field contains your stringified JSON tokens
          const { access_token } = JSON.parse(credentials.password);
          setToken(access_token);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        // Essential: Mark as finished so RootNavigator can stop showing Splash
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};