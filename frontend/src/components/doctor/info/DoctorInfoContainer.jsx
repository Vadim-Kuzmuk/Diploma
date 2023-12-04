import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { responseStatus } from "../../../utils/consts";
import notification from "../../elements/notification/Notification";
import DoctorPersonalInfoContainer from "./DoctorPersonalInfoContainer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkFilterItem, fetchFilterData } from "../../../utils/fetchFilterData";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";

const DoctorInfoContainer = ({ setNotification }) => {

  return <div
    style={{
      zIndex: "100",
      display: "flex",
      flexDirection: "row"
    }}
  >
    {/* add here form */}
    <div
      style={{
        position: "absolute",
        right: 0
      }}
    >
      <DoctorPersonalInfoContainer setNotification={setNotification}/>
    </div>
  </div>;
};

export default DoctorInfoContainer;