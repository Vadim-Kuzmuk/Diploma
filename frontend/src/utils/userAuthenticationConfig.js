import { getExpirationDate, isExpired } from "./checkExpiredToken";
import eventBus from "./eventBus";
import { useContext } from "react";
import { AppContext } from "../App";

const userAuthenticationConfig = (jsonld = true, multipart = false) => {
  let timeZone = new Date().getTimezoneOffset();
  let type = jsonld ? "application/json+ld" : "application/json";
  let contentType = multipart ? "multipart/form-data" : type;

  if (localStorage.getItem("token") !== null) {
    if (isExpired(getExpirationDate(localStorage.getItem("token")))) {
      eventBus.dispatch("logout", { expired: true });
      return;
    }

    return {
      headers: {
        "Content-Type": contentType,
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Accept": type,
        "Timezone-Offset": timeZone
      }
    };
  }

  return {
    headers: {
      "Content-Type": contentType,
      "Accept": type,
      "Timezone-Offset": timeZone
    }
  };
};

export default userAuthenticationConfig;