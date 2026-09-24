import { createBrowserRouter, Navigate } from 'react-router';

import { ErrorPage } from '@/pages/error';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { SignInPage } from '@/pages/auth';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { RootLayout } from '@/widgets/root-layout';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout header={<Header />} footer={<Footer />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'auth/sign-in',
        element: <SignInPage />,
      },
      {
        path: 'auth/signin',
        element: <Navigate to="/auth/sign-in" replace />,
      },
      {
        path: 'signin',
        element: <Navigate to="/auth/sign-in" replace />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
