import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { createContext, Suspense, useEffect, useMemo, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { CircularProgress } from "@mui/material";
import nprogress from "nprogress";
import NotFoundPage from "./pages/notFound/NotFoundPage";
import routes from "./routes/routes";
import getUserInfo from "./utils/getUserInfo";
import eventBus from "./utils/eventBus";
import "nprogress/nprogress.css";
import "./assets/css/main.css";
import Header from "./components/elements/header/header";
import clientRoutesConcat from "./routes/clientRoutes";
import jwt_decode from "jwt-decode";
import adminRoutesConcat from "./routes/adminRoutes";

export const AppContext = createContext({});

function App () {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("token"));
  const location = useLocation();
  const navigate = useNavigate();


  const authRouteRender = () => {
    if (!authenticated) {

      return (
        routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))
      );
    } else {
      const { roles } = jwt_decode(localStorage.getItem("token"));
      let roleRoutes;
      switch (true) {
        case roles.includes("ROLE_CLIENT"): roleRoutes = clientRoutesConcat; break;
        case roles.includes("ROLE_ADMIN"): roleRoutes = adminRoutesConcat; break;
        default: roleRoutes = routes; break;
      }
      return (
        roleRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))
      );
    }
  };

  const handleOnIdle = () => {
    eventBus.on("logout", (data) => {

      localStorage.removeItem("clientId");
      localStorage.removeItem("token");

      setAuthenticated(false);
      navigate("/");
    });
  };

  useMemo(() => {
    nprogress.start();
  }, [location]);

  useEffect(() => {
    nprogress.done();
  }, [location]);

  useEffect(() => {
    handleOnIdle();
  }, []);

  return (
    <AppContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        timeZone: new Date().getTimezoneOffset(),
        user: getUserInfo()
      }}
    >
      <HelmetProvider>
        <Header />
        <div className="container">
          <Suspense fallback={<CircularProgress />}>
            <Routes>
              {authRouteRender()}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </HelmetProvider>
    </AppContext.Provider>
  );
}

export default App;
