import { lazy } from "react";
import routes from "./routes";

const CabinetPage = lazy(() => import("../pages/client/CabinetPage"));
const ChangePasswordPage = lazy(() => import("../pages/client/ChangePasswordPage"));

const clientRoutes = [
  {
    path: "/cabinet",
    element: <CabinetPage />
  },
  {
    path: "/cabinet/change-password",
    element: <ChangePasswordPage />
  }
];

const clientRoutesConcat = clientRoutes.concat(routes);

export default clientRoutesConcat;