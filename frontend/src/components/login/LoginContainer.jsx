import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import LoginForm from "./LoginForm";
import Notification from "../elements/notification/Notification";
import { authentication } from "../../utils/authenticationRequest";
import { responseStatus } from "../../utils/consts";
import { AppContext } from "../../App";

const Login = () => {
  const navigate = useNavigate();

  const { timeZone, setAuthenticated, authenticated } = useContext(AppContext);

  const [authData, setAuthData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  const authenticationRequest = () => {
    if (!authData) {
      return;
    }

    setLoading(true);

    axios.post(`/api/login-check`, authData, { headers: { "Timezone-Offset": timeZone } }).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setAuthenticated(true);
      }
    }).catch(error => {
      setError(error.response.data.message);
      const message = error.response.data.message === "Invalid credentials." ? "Невірні дані для входу!" : error.response.data.message;
      setNotification({ ...notification, visible: true, type: "error", message: message });
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    authenticationRequest();
  }, [authData]);

  useEffect(() => {
    authentication(navigate, authenticated);
  }, [authenticated]);

  return (
    <>
      {notification.visible &&
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      }
      <Helmet>
        <title>
          Вхід
        </title>
      </Helmet>
      <LoginForm
        setAuthData={setAuthData}
        loading={loading}
      />
    </>
  );
};

export default Login;