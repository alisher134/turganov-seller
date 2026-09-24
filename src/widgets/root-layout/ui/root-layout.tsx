import type { ReactNode } from 'react';
import { Outlet } from 'react-router';

export type RootLayoutProps = {
  header?: ReactNode;
  footer?: ReactNode;
};

export function RootLayout({ header, footer }: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {header}
      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>
      {footer}
    </div>
  );
}
