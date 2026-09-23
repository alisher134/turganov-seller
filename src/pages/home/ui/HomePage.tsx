import { Button } from '@/shared/ui';

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Главная страница</h1>
      <p className="max-w-md text-muted-foreground">
        Архитектура Feature-Sliced Design (FSD) и Data-based маршрутизация успешно настроены.
      </p>
      <Button>Нажми меня</Button>
    </div>
  );
}
