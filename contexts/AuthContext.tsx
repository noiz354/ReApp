import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../services/navigationRef';

type AuthContextType = {
  token: string | null;
  setToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({ token: null, setToken: () => {} });

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (token) {
      // verify every 60 seconds
      const verify = async () => {
        try {
          const res = await fetch('/web/auth/token/verify/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ token }),
          });
          if (res.status === 401) {
            // unauthorized: clear token and redirect to onboarding
            setToken(null);
            try { await AsyncStorage.setItem('@onboarded', 'false'); } catch (e) {}
            try { await AsyncStorage.removeItem('@token'); } catch (e) {}
            if (navigationRef.isReady()) navigationRef.navigate('Onboarding' as any);
          }
        } catch (e) {
          // network errors: ignore for now
        }
      };

      // immediate verify then schedule
      verify();
      interval = (setInterval(verify, 60000) as unknown) as number;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token]);

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
