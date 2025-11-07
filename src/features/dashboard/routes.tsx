import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";

const DashboardLayout = lazy(() => import("./ui/DashboardLayout"));
const DashboardOverviewPage = lazy(() => import("./ui/DashboardOverviewPage"));
const DashboardOrdersPage = lazy(() => import("./ui/DashboardOrdersPage"));

const DashboardUsersPage = lazy(() => import("./ui/user/DashboardUsersPage"));
const AddUserPage = lazy(() => import("./ui/user/AddUserPage"));
const ViewEditUserPage = lazy(() => import("./ui/user/ViewEditUserPage"));

const DashboardCarsPage = lazy(() => import("./ui/car/DashboardCarsPage"));
const AddCarPage = lazy(() => import("./ui/car/AddCarPage"));
const ViewEditCarPage = lazy(() => import("./ui/car/ViewEditCarPage"));

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardOverviewPage /> },
      { path: "users", element: <DashboardUsersPage /> },
      { path: "users/add", element: <AddUserPage /> },
      { path: "users/:id", element: <ViewEditUserPage /> },
      //car
      { path: "cars", element: <DashboardCarsPage /> },
      { path: "cars/add", element: <AddCarPage /> },
      { path: "cars/:id", element: <ViewEditCarPage /> },
      { path: "orders", element: <DashboardOrdersPage /> },
    ],
  },
];
