import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const LoginPageDriver = lazy(() => import("./ui/LoginPageDriver"));
const LoginPageOwner = lazy(() => import("./ui/LoginPageOwner"));
const LoginPageAdmin = lazy(() => import("./ui/LoginPageAdmin"));
const MobilePage = lazy(() => import("./ui/MobilePage"));
const OtpPage = lazy(() => import("./ui/OtpPage"));
const SignupPage = lazy(() => import("./ui/SignupPage"));

export const authRoutes: RouteObject[] = [
  { path: "/owner", element: <LoginPageOwner /> },
  { path: "/panel/admin", element: <LoginPageAdmin /> },
  { path: "/driver", element: <LoginPageDriver /> },

  { path: "/auth/phone", element: <MobilePage /> },
  { path: "/auth/otp", element: <OtpPage /> },
  { path: "/auth/signup", element: <SignupPage /> },
];
