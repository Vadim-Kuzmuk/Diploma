import DoctorReceptionTimeForm from "./DoctorReceptionTimeForm";
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

  const [receptionDay, setReceptionDay] = useState();
  const [receptionStartTime, setReceptionStartTime] = useState();
  const [receptionEndTime, setReceptionEndTime] = useState();
  const [confirmedReceptionStartDateTime, setConfirmedReceptionStartDateTime] = useState();
  const [confirmedReceptionEndDateTime, setConfirmedReceptionEndDateTime] = useState();

  const createReceptionTime = () => {

    if (!(confirmedReceptionEndDateTime && confirmedReceptionStartDateTime)) {
      return;
    }
    const { id } = jwt_decode(localStorage.getItem("token"));
    axios.post("api/reception-times", {
        start: confirmedReceptionStartDateTime.toString(),
        end: confirmedReceptionEndDateTime.toString(),
        doctor: id
      },
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      }).then(response => {
      if (response.status === responseStatus.HTTP_CREATED) {
        setNotification({
          ...notification,
          visible: true,
          type: "success",
          message: "Запис успішно створено!"
        });
      }
    }).catch(error => {
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка! Перевірте дані або спробуйте пізніше"
      });
    });
  };


  useEffect(() => {
    createReceptionTime();
  }, [confirmedReceptionStartDateTime, confirmedReceptionEndDateTime]);


  return <div
    style={{
      zIndex: "100",
      display: "flex",
      flexDirection: "row"
    }}
  >
    <DoctorReceptionTimeForm
      receptionDay={receptionDay}
      receptionEndTime={receptionEndTime}
      receptionStartTime={receptionStartTime}
      confirmedReceptionStartDateTime={confirmedReceptionStartDateTime}
      confirmedReceptionEndDateTime={confirmedReceptionEndDateTime}
      setReceptionDay={setReceptionDay}
      setReceptionStartTime={setReceptionStartTime}
      setReceptionEndTime={setReceptionEndTime}
      setConfirmedReceptionStartDateTime={setConfirmedReceptionStartDateTime}
      setConfirmedReceptionEndDateTime={setConfirmedReceptionEndDateTime}
      setNotification={setNotification}
    />
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