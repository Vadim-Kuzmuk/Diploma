import { useEffect, useState } from "react";
import DoctorPersonalInfo from "./DoctorPersonalInfo";
import jwt_decode from "jwt-decode";
import axios from "axios";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";
import { responseStatus } from "../../../utils/consts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkFilterItem, fetchFilterData } from "../../../utils/fetchFilterData";
import notification from "../../elements/notification/Notification";

const DoctorPersonalInfoContainer = ({ setNotification }) => {

  const [doctor, setDoctor] = useState();

  const [appointModalOpen, setAppointModalOpen] = useState(false);

  const { id } = jwt_decode(localStorage["token"]);

  const fetchDoctor = () => {

    axios.get("api/users/" + id, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK) {
        setDoctor(response.data);
      }
    }).catch(error => {
      console.log("error fetching doctor");
    });
  };

  useEffect(() => {
    fetchDoctor();
  }, [appointModalOpen]);

  return <DoctorPersonalInfo
    doctor={doctor}
    appointModalOpen={appointModalOpen}
    setAppointModalOpen={setAppointModalOpen}
    setNotification={setNotification}
  />;
};

export default DoctorPersonalInfoContainer;