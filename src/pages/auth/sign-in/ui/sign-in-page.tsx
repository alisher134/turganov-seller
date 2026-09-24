import { SignInForm } from '@/features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';

export function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Вход в систему</CardTitle>
          <CardDescription>
            Введите имя пользователя и пароль для доступа к личному кабинету
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
