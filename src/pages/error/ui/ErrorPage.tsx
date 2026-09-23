import { isRouteErrorResponse, useRouteError, Link } from 'react-router';
import { Button } from '@/shared/ui';

export function ErrorPage() {
  const error = useRouteError();
  let errorMessage = 'Произошла непредвиденная ошибка';

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}: ${String(error.data || 'Страница не найдена')}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-foreground">
      <h1 className="text-3xl font-bold tracking-tight">Ошибка</h1>
      <p className="text-muted-foreground">{errorMessage}</p>
      <Button asChild>
        <Link to="/">Вернуться на главную</Link>
      </Button>
    </div>
  );
}
