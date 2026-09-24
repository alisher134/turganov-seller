import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from '@/widgets/root-layout';
import { HomePage } from '@/pages/home';
import { SignInPage } from '@/pages/auth';
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
        path: 'auth/signin',
        element: <SignInPage />,
      },
      {
        path: 'signin',
        element: <Navigate to="/auth/signin" replace />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
