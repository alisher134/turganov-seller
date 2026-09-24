import { z } from 'zod';

export const signInSchema = z.object({
  username: z
    .string()
    .min(1, 'Имя пользователя обязательно для заполнения')
    .min(3, 'Имя пользователя должно содержать не менее 3 символов'),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(6, 'Пароль должен содержать не менее 6 символов'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
