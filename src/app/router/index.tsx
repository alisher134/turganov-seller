import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/widgets/root-layout';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { ErrorPage } from '@/pages/error';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
