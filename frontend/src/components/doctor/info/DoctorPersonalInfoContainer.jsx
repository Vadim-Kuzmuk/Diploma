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

  const [gettingReceptionDay, setGettingReceptionDay] = useState();
  const [gettingReceptionTimes, setGettingReceptionTimes] = useState();

  const [daysWithSchedule, setDaysWithSchedule] = useState();

  const [editReceptionTimeId, setEditReceptionTimeId] = useState();
  const [editReceptionTimeInfo, setEditReceptionTimeInfo] = useState(null);

  const [editStartValue, setEditStartValue] = useState();
  const [editEndValue, setEditEndValue] = useState();

  const [deleteReceptionTimeId, setDeleteReceptionTimeId] = useState(null);
  const [editConfirmed, setEditConfirmed] = useState(false);

  const [appointModalOpen, setAppointModalOpen] = useState(false);

  const { id } = jwt_decode(localStorage["token"]);

  const fetchScheduleDays = () => {
    axios.get("/api/doctor-schedule/" + id, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setDaysWithSchedule(response.data["hydra:member"]);
      }
    }).catch(error => {
      console.log("error fetching schedule days");
    });
  };

  const fetchDoctor = () => {

    axios.get("api/users/" + id, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK) {
        setDoctor(response.data);
      }
    }).catch(error => {
      console.log("error fetching doctor");
    });
  };

  const fetchReceptionTimesByDay = () => {

    axios.get("api/doctor-reception-times/" + id + "?day=" + gettingReceptionDay, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK) {
        setGettingReceptionTimes(response.data["hydra:member"]);
      }
    }).catch(error => {
      console.log("error fetching doctors reception times");
    });
  };

  const editReceptionTime = () => {
    axios.patch(`api/reception-times/${editReceptionTimeId}`, { start: editStartValue.toString(), end: editEndValue.toString() }, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK) {
        fetchReceptionTimesByDay();
        fetchScheduleDays();
      }
    }).catch(error => {
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка! Перевірте дані або спробуйте пізніше"
      })
    });
  };

  const deleteReceptionTime = () => {
    axios.delete("api/reception-times/" + deleteReceptionTimeId, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_NO_CONTENT) {
        fetchReceptionTimesByDay();
        fetchScheduleDays();
      }
    }).catch(error => {
      console.log("error deleting reception time");
    });
  };

  useEffect(() => {
    if(editConfirmed && (editStartValue || editEndValue)) {
      editReceptionTime();
      fetchReceptionTimesByDay();
      setEditConfirmed(false)
    }
  }, [editConfirmed]);

  useEffect(() => {
    fetchDoctor();
  }, [appointModalOpen]);

  useEffect(() => {
    fetchDoctor();
    fetchScheduleDays();
  }, []);

  useEffect(() => {
    fetchReceptionTimesByDay();
  }, [gettingReceptionDay]);

  useEffect(() => {
    if(deleteReceptionTimeId !==null) {
      deleteReceptionTime();
      setDeleteReceptionTimeId(null);
    }
  }, [deleteReceptionTimeId]);

  return <DoctorPersonalInfo
    doctor={doctor}
    setGettingReceptionDay={setGettingReceptionDay}
    gettingReceptionDay = {gettingReceptionDay}
    gettingReceptionTimes={gettingReceptionTimes}
    days={daysWithSchedule}
    setDeleteReceptionTimeId={setDeleteReceptionTimeId}
    setEditReceptionTimeId={setEditReceptionTimeId}
    appointModalOpen={appointModalOpen}
    setAppointModalOpen={setAppointModalOpen}
    setNotification={setNotification}
    setEditConfirmed = {setEditConfirmed}
    setEditStartInfo = {setEditStartValue}
    setEditEndInfo = {setEditEndValue}
  />;
};

export default DoctorPersonalInfoContainer;