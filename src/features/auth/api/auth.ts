import { apiClient } from '@/shared/api';

import type { SignInFormValues } from '../model/sign-in-schema';

export interface User {
  id: string;
  username?: string;
  email?: string;
  name?: string | null;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export const authApi = {
  signIn: async (dto: SignInFormValues): Promise<SignInResponse> => {
    const response = await apiClient.post<SignInResponse>('/auth/sign-in', dto);
    return response.data;
  },
};
