import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import RegisterForm from "./RegisterForm";
import Notification from "../elements/notification/Notification";
import { authentication } from "../../utils/authenticationRequest";
import { responseStatus } from "../../utils/consts";
import { AppContext } from "../../App";

const RegisterContainer = () => {
  const navigate = useNavigate();

  const {timeZone, setAuthenticated, authenticated } = useContext(AppContext);

  const [authData, setAuthData] = useState();
  const [registerData, setRegisterData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  const registrationRequest = () => {
    if (!registerData) {
      return;
    }

    setLoading(true);

    axios.post(`/api/users`, { ...registerData, birthday: registerData.birthday.toString() }, {
      headers: {
        "Content-Type": "application/json",
        "Timezone-Offset": timeZone
      }
    }).then(response => {
      if (response.status === responseStatus.HTTP_CREATED) {
        setAuthData({
          username: registerData.email,
          password: registerData.plainPassword
        });
      }
    }).catch(error => {
      setError(error.response.data.message);
      console.log(error.response);
      const message = error.response.data.detail?.includes("email: already-registered") ? "Така адреса електроної пошти вже зареєстрована!" : error.response.data.detail;
      setNotification({ ...notification, visible: true, type: "error", message: message });
    }).finally(() => setLoading(false));
  };

  const authenticationRequest = () => {
    if (!authData) {
      return;
    }

    setLoading(true);

    axios.post(`/api/login-check`, authData).then(response => {
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
    registrationRequest();
  }, [registerData]);

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
          Реєстрація
        </title>
      </Helmet>
      <RegisterForm
        notification={notification}
        setNotification={setNotification}
        setRegisterData={setRegisterData}
        loading={loading}
      />
    </>
  );
};

export default RegisterContainer;