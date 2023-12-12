import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { responseStatus } from "../../../utils/consts";
import notification from "../../elements/notification/Notification";
import DoctorPersonalInfoContainer from "./DoctorPersonalInfoContainer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkFilterItem, fetchFilterData } from "../../../utils/fetchFilterData";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";
import WorkContainer from "../work/WorkContainer";

const DoctorInfoContainer = ({ setNotification }) => {

  return <div
    style={{
      zIndex: "100",
      display: "flex",
      flexDirection: "column"
    }}
  >
    <WorkContainer />
    <div
      style={{
        position: "absolute",
        right: 0
      }}
    >
      <DoctorPersonalInfoContainer setNotification={setNotification} />
    </div>
  </div>;
};

export default DoctorInfoContainer;