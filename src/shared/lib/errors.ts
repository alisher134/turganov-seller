import { isAxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Произошла непредвиденная ошибка',
): string {
  if (!error) return fallback;

  if (isAxiosError<ApiErrorResponse>(error)) {
    const errorData = error.response?.data;
    if (errorData) {
      if (Array.isArray(errorData.message)) {
        return errorData.message.join(', ');
      }
      if (typeof errorData.message === 'string') {
        return errorData.message;
      }
      if (typeof errorData.error === 'string') {
        return errorData.error;
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}
