// src/api/AbstractApiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as Keychain from 'react-native-keychain';
import { triggerGlobalLogout } from '../utils/authEmitter';

/**
 * Abstract Base Class
 * Handles the "How" (Interceptors, Auth logic, Retries).
 * Defer the "Where" (Base URL) to children.
 */
export abstract class AbstractApiClient {
  protected abstract getBaseURL(): string;
  public readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.getBaseURL(),
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const credentials = await Keychain.getGenericPassword();
            const tokens = credentials ? JSON.parse(credentials.password) : null;

            // ---------------------------------------------------------
            // REFRESH LOGIC
            // This is hardcoded as requested. It always hits the Auth Server,
            // regardless of which child class (BaseURL) is active.
            // ---------------------------------------------------------
            const res = await axios.post('https://www.machinesitelearning.com/api/auth/refresh', {
              refresh_token: tokens?.refresh_token,
            });

            // Save new tokens
            await Keychain.setGenericPassword('session', JSON.stringify(res.data));

            // Update header
            originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
            
            // IMPORTANT: Ensure the retry uses the current instance's Base URL
            originalRequest.baseURL = this.getBaseURL();

            // Retry the request using THIS instance
            return this.client(originalRequest);
          } catch (refreshError) {
            // Session is dead -> Logout
            await triggerGlobalLogout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }
}

// =================================================================
// CONCRETE IMPLEMENTATIONS
// =================================================================

/**
 * ID: 0
 * The Main Production Client
 */
class ProductionClient extends AbstractApiClient {
  protected getBaseURL(): string {
    return 'https://www.machinesitelearning.com/api';
  }
}

/**
 * ID: 1
 * The Content Clone / Search Service
 */
class ContentCloneClient extends AbstractApiClient {
  protected getBaseURL(): string {
    return 'https://content-clone-search-4b75e4510f4d.herokuapp.com';
  }
}

// =================================================================
// 1. THE REGISTRY (Recipes)
// =================================================================
// Maps an ID to a Class Constructor.
// We use a specific type to ensure the classes extend AbstractApiClient.
type ClientConstructor = new () => AbstractApiClient;

const clientRegistry: Record<number, ClientConstructor> = {
  0: ProductionClient, // ID 0 -> Production
  1: ContentCloneClient, // ID 1 -> Content Clone
};

// =================================================================
// 2. THE GLOBAL CACHE (The HashMap)
// =================================================================
// This variable lives in the module scope, effectively making it a Singleton.
// It starts empty.
const globalClientCache = new Map<number, AxiosInstance>();

// =================================================================
// 3. THE ACCESSOR (Lazy Loader)
// =================================================================
export const getApiClient = (envId: number = 0): AxiosInstance => {
  // A. Check Cache: If we already have this client, return it immediately.
  if (globalClientCache.has(envId)) {
    // console.log(`[Cache Hit] Returning existing client for ID: ${envId}`);
    return globalClientCache.get(envId)!;
  }

  // B. Cache Miss: We need to create it.
  // console.log(`[Cache Miss] Creating new client for ID: ${envId}`);

  // 1. Find the correct class, fallback to Production (ID 0) if invalid ID
  const ClientClass = clientRegistry[envId] || ProductionClient;
  
  // 2. Instantiate the wrapper class (which creates the axios instance)
  const wrapperInstance = new ClientClass();

  // 3. Store the underlying axios instance in the Global Cache
  // This populates the map. If you call this for 0 and 1, map size is 2.
  globalClientCache.set(envId, wrapperInstance.client);

  // 4. Return the usable axios instance
  return wrapperInstance.client;
};

// OPTIONAL: Default export for the most common use case (Production)
export default getApiClient(0);