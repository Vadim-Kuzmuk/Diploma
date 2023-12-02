import jwt_decode from "jwt-decode";
import eventBus from "./eventBus";

const authentication = (navigate, authenticated, setVisible = null) => {

  if (authenticated) {
    const { userId, roles } = jwt_decode(localStorage.getItem("token"));

    eventBus.dispatch("login-user", { "id": userId });

    navigate("/");

    if (setVisible) {
      setVisible(true);
    }
  }
};

export { authentication };
