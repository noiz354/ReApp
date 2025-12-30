import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_BASE_URL = 'https://www.machinesitelearning.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token to every request
apiClient.interceptors.request.use(async (config) => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    config.headers.Authorization = `Bearer ${credentials.password}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle Edge Cases (401, 500, etc.)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Edge Case: Token expired (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement Refresh Token logic here if endpoint exists
        // const newTokens = await refreshAuthToken(); 
        // return apiClient(originalRequest);
      } catch (refreshError) {
        await Keychain.resetGenericPassword();
        // Redirect to Login would happen via your Navigation State
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;