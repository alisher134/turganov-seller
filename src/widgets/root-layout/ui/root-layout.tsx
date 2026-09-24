import { Outlet } from 'react-router';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
