import { Link, NavLink } from 'react-router';

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold tracking-tight">
          wb-suhrat
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-foreground underline underline-offset-4'
                : 'text-muted-foreground transition-colors hover:text-foreground'
            }
          >
            Главная
          </NavLink>
          <NavLink
            to="/auth/signin"
            className={({ isActive }) =>
              isActive
                ? 'text-foreground underline underline-offset-4'
                : 'text-muted-foreground transition-colors hover:text-foreground'
            }
          >
            Вход
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
