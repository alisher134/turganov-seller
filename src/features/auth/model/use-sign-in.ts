import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { getErrorMessage, tokenStorage } from '@/shared/lib';
import { authApi, type SignInResponse } from '../api';
import type { SignInFormValues } from './schema';

export interface UseSignInOptions {
  onSuccess?: (data: SignInResponse) => void;
}

export function useSignIn(options?: UseSignInOptions) {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: SignInFormValues) => authApi.signIn(data),
    onSuccess: (response) => {
      tokenStorage.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      options?.onSuccess?.(response);
      navigate('/', { replace: true });
    },
  });

  const authError = mutation.error
    ? getErrorMessage(mutation.error, 'Неверный email или пароль')
    : null;

  return {
    signIn: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    authError,
    reset: mutation.reset,
    mutation,
  };
}
