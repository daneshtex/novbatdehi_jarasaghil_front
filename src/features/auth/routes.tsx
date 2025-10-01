import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('./ui/LoginPage'));
const MobilePage = lazy(() => import('./ui/MobilePage'));
const OtpPage = lazy(() => import('./ui/OtpPage'));
const SignupPage = lazy(() => import('./ui/SignupPage'));

export const authRoutes: RouteObject[] = [
  { path: '/', element: <LoginPage /> },
  { path: '/auth/phone', element: <MobilePage /> },
  { path: '/auth/otp', element: <OtpPage /> },
  { path: '/auth/signup', element: <SignupPage /> },
];


