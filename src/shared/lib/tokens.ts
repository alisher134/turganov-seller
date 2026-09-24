import { storage } from './storage';

const ACCESS_TOKEN_KEY = 'turganov:access_token';
const REFRESH_TOKEN_KEY = 'turganov:refresh_token';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export const tokenStorage = {
  getAccessToken: (): string | null => storage.getString(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string): void => storage.set(ACCESS_TOKEN_KEY, token),
  removeAccessToken: (): void => storage.remove(ACCESS_TOKEN_KEY),

  getRefreshToken: (): string | null => storage.getString(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => storage.set(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: (): void => storage.remove(REFRESH_TOKEN_KEY),

  getTokens: () => ({
    accessToken: storage.getString(ACCESS_TOKEN_KEY),
    refreshToken: storage.getString(REFRESH_TOKEN_KEY),
  }),

  setTokens: ({ accessToken, refreshToken }: AuthTokens): void => {
    storage.set(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens: (): void => {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
  },

  hasAccessToken: (): boolean => Boolean(storage.getString(ACCESS_TOKEN_KEY)),
};

export const tokens = tokenStorage;
