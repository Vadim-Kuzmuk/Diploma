import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";
import { responseStatus } from "../../../utils/consts";
import Notification from "../../elements/notification/Notification";
import ChangePasswordForm from "./ChangePasswordForm";
import { useNavigate } from "react-router-dom";

const ChangePasswordContainer = () => {
  const navigate = useNavigate();
  const { id, username } = jwt_decode(localStorage.getItem("token"));
  const [passwords, setPasswords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  const patchPassword = () => {
    if (!passwords) {
      return;
    }

    setLoading(true);
    axios.patch(`/api/users/` + id, { plainPassword: passwords.new }, userAuthenticationConfig()).then(response => {
      console.log(response);
      if (response.status === responseStatus.HTTP_OK && response.data) {
        navigate("/cabinet");
      }
    }).catch(error => {
      console.log("error patching user password");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при зміні паролю!"
      });
    }).finally(() => setLoading(false));
  };

  const checkLogin = () => {
    if (!passwords) {
      return;
    }

    setLoading(true);
    axios.post(`/api/login-check`, { username: username, password: passwords.old }).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data.token) {
        patchPassword();
      }
    }).catch(error => {
      const message = error.response.data.message === "Invalid credentials." ? "Невірний пароль!" : "Сталася помилка! Спробуйте пізніше";
      setNotification({ ...notification, visible: true, type: "error", message: message });
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    checkLogin();
  }, [passwords]);

  return (
    <>
      <Helmet>
        <title>
          Змінити пароль
        </title>
      </Helmet>
      {notification.visible &&
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      }
      <ChangePasswordForm
        setPasswords={setPasswords}
        setNotification={setNotification}
        notification={notification}
        loading={loading}
      />
    </>
  );
};

export default ChangePasswordContainer;