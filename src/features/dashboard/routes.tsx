import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import RequireAuth from '../auth/RequireAuth';

const DashboardLayout = lazy(() => import('./ui/DashboardLayout'));
const DashboardOverviewPage = lazy(() => import('./ui/DashboardOverviewPage'));
const DashboardUsersPage = lazy(() => import('./ui/DashboardUsersPage'));
const DashboardOrdersPage = lazy(() => import('./ui/DashboardOrdersPage'));

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardOverviewPage /> },
      { path: 'users', element: <DashboardUsersPage /> },
      { path: 'orders', element: <DashboardOrdersPage /> },
    ],
  },
];


