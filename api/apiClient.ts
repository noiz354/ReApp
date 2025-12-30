import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { triggerGlobalLogout } from '../utils/authEmitter';

const apiClient = axios.create({
  baseURL: 'https://www.machinesitelearning.com/api',
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const credentials = await Keychain.getGenericPassword();
        const tokens = credentials ? JSON.parse(credentials.password) : null;

        // Attempt refresh
        const res = await axios.post('https://www.machinesitelearning.com/api/auth/refresh', {
          refresh_token: tokens?.refresh_token,
        });

        await Keychain.setGenericPassword('session', JSON.stringify(res.data));
        
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // EDGE CASE: If the refresh request itself returns 401/403, 
        // the session is completely dead. Trigger auto-logout.
        await triggerGlobalLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;