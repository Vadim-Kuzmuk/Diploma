import { lazy } from "react";
import routes from "./routes";

const AdminPanelPage = lazy(() => import("../pages/admin/AdminPanelPage"));
const DoctorRegisterPage = lazy(() => import("../pages/admin/DoctorRegisterPage"));

const adminRoutes = [
  {
    path: "/admin-panel",
    element: <AdminPanelPage />
  },
  {
    path: "/admin-panel/new-doctor",
    element: <DoctorRegisterPage/>
  }
];

const adminRoutesConcat = adminRoutes.concat(routes);

export default adminRoutesConcat;