import { lazy } from "react";
const HomePage = lazy(() => import("../pages/home/HomePage"));
const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/register/RegisterPage"));
const AdminPanelPage = lazy(() => import("../pages/admin/AdminPanelPage"));
const DoctorCabinetPage = lazy(() => import("../pages/doctor/DoctorCabinetPage"));

const routes = [
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/admin-panel",
    element: <AdminPanelPage />
  },
  {
    path: "/doctor-cabinet",
    element: <DoctorCabinetPage />
  }
];

export default routes;