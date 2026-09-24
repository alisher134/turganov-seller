import { RouterProvider } from 'react-router';
import { QueryProvider } from './providers';
import { appRouter } from './router';

export function App() {
  return (
    <QueryProvider>
      <RouterProvider router={appRouter} />
    </QueryProvider>
  );
}
