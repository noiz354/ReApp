// src/api/AbstractApiClient.ts
import axios, { AxiosInstance } from 'axios';
import * as Keychain from 'react-native-keychain';
import { triggerGlobalLogout } from '../utils/authEmitter';

type StoredTokens = {
  access: string;
  refresh: string;
};

export abstract class AbstractApiClient {
  protected abstract getBaseURL(): string;
  public readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.getBaseURL(),
    });

    this.setupInterceptors();
  }

  private async loadTokens(): Promise<StoredTokens | null> {
    try {
      const x = await Keychain.getGenericPassword();
      if (!x) return null;

      const parsed = JSON.parse(x.password);
      if (
        typeof parsed?.access === 'string' &&
        typeof parsed?.refresh === 'string'
      ) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  private setupInterceptors() {
    // =========================
    // REQUEST
    // =========================
    this.client.interceptors.request.use(
      async (config) => {
        const tokens = await this.loadTokens();

        if (tokens?.access) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${tokens.access}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // =========================
    // RESPONSE
    // =========================
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = await this.loadTokens();
            if (!tokens) throw new Error('No refresh token');

            const res = await axios.post(
              'https://www.machinesitelearning.com/api/auth/refresh',
              { refresh: tokens.refresh }
            );

            // res.data MUST match { access, refresh }
            await Keychain.setGenericPassword(
              'session',
              JSON.stringify(res.data)
            );

            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            originalRequest.baseURL = this.getBaseURL();

            return this.client(originalRequest);
          } catch {
            await triggerGlobalLogout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

// =================================================================
// CONCRETE CLIENTS
// =================================================================

class ProductionClient extends AbstractApiClient {
  protected getBaseURL(): string {
    return 'https://www.machinesitelearning.com/api';
  }
}

class ContentCloneClient extends AbstractApiClient {
  protected getBaseURL(): string {
    return 'https://content-clone-search-4b75e4510f4d.herokuapp.com';
  }
}

// =================================================================
// FACTORY (NO CACHE)
// =================================================================

export const getApiClient = (envId: number = 0): AxiosInstance => {
  const ClientClass =
    envId === 1 ? ContentCloneClient : ProductionClient;

  return new ClientClass().client;
};

// Default export
export default getApiClient(0);
