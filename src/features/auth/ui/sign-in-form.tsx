import { LogIn } from 'lucide-react';

import { useZodForm } from '@/shared/hooks';
import {
  AppForm,
  Button,
  ErrorAlert,
  FieldGroup,
  LoaderGate,
  PasswordField,
  Show,
  Spinner,
  TextField,
} from '@/shared/ui';

import type { SignInResponse } from '../api';
import { signInSchema, useSignIn, type SignInFormValues } from '../model';

export interface SignInFormProps {
  onSuccess?: (data: SignInResponse) => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { signIn, authError, isPending } = useSignIn({ onSuccess });

  const form = useZodForm(signInSchema, {
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: SignInFormValues) => {
    await signIn(data);
    form.reset();
  };

  return (
    <>
      <Show when={authError != null} data={authError}>
        {(error) => <ErrorAlert errorMessage={error} className="mb-4" />}
      </Show>

      <AppForm form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
        {({ register, formState: { errors, isSubmitting } }) => {
          const isLoading = isSubmitting || isPending;

          return (
            <>
              <FieldGroup>
                <TextField
                  id="username"
                  label="Имя пользователя"
                  placeholder="например, user123"
                  autoComplete="username"
                  disabled={isLoading}
                  error={errors.username?.message}
                  {...register('username')}
                />

                <PasswordField
                  id="password"
                  label="Пароль"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  error={errors.password?.message}
                  {...register('password')}
                />
              </FieldGroup>

              <Button type="submit" disabled={isLoading} className="w-full">
                <LoaderGate
                  isLoading={isLoading}
                  loaderSlot={
                    <>
                      <Spinner />
                      Вход...
                    </>
                  }
                >
                  <LogIn data-icon="inline-start" />
                  Войти
                </LoaderGate>
              </Button>
            </>
          );
        }}
      </AppForm>
    </>
  );
}
