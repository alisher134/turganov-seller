import { Link } from 'react-router';

import { Button } from '@/shared/ui';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
      <p className="text-muted-foreground">Страница не найдена</p>
      <Button asChild variant="outline">
        <Link to="/">На главную</Link>
      </Button>
    </div>
  );
}
