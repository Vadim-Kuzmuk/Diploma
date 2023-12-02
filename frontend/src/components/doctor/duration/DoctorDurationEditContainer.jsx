import { useEffect, useState } from "react";
import DoctorDurationEditForm from "./DoctorDurationEditForm";
import axios from "axios";
import jwt_decode from "jwt-decode";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";
import { responseStatus } from "../../../utils/consts";
import notification from "../../elements/notification/Notification";

const DoctorDurationEditContainer = ({ duration, setNotification }) => {

  const [doctorDuration, setDoctorDuration] = useState(duration);
  const [doctorInfoId, setDoctorInfoId] = useState(null);

  const updateDoctorDuration = () => {

    const { id } = jwt_decode(localStorage.getItem("token"));

    axios.get(`/api/doctor-infos`, userAuthenticationConfig()).then((response) => {
      if (
        response.status === responseStatus.HTTP_OK &&
        response.data["hydra:member"]
      ) {
        const doctorInfo = response.data["hydra:member"].find(
          (doctor) => doctor.user.id === id.replace("0x", "")
        );
        setDoctorInfoId(doctorInfo.id)
      }}).catch(error=>{
        console.log("error");
      })

    axios.patch("api/doctor-infos/" + doctorInfoId, doctorDuration, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK) {
        setNotification({
          ...notification,
          visible: true,
          type: "success",
          message: "Тривалість прийому успішно оновлено!"
        });
      }
    }).catch(error => {
      console.log("error patching duration");
    });
  };

  useEffect(() => {
    updateDoctorDuration();
  }, [doctorDuration]);

  return <>
    <DoctorDurationEditForm
      doctorDuration={doctorDuration}
      setDoctorDuration={setDoctorDuration}
    />
  </>;
};

export default DoctorDurationEditContainer;