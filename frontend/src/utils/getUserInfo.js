import jwt_decode from "jwt-decode";

const getUserInfo = () => {
  let token = null;

  if (localStorage.getItem("token") !== "") {
    try {
      token = jwt_decode(localStorage.getItem("token"));
    } catch (e) {
      return null;
    }
    return token;
  }

  return null;
};

export default getUserInfo;