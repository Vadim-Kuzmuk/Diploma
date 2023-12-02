import axios from "axios";
import { useEffect, useState } from "react";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";
import { responseStatus } from "../../../utils/consts";
import ScheduleList from "./ScheduleList";

const ScheduleContainer = () => {

  const doctor = "1ee52da1-b94d-60a8-abb6-3b1a6af881be";

  const [schedule, setSchedule] = useState(null);
  const [visitDate, setVisitDate] = useState();

  const createVisit = () => {
    axios.post("api/visits", { doctor: doctor, date: visitDate }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (responseStatus.HTTP_CREATED) {
        console.log("visit created successfully");
      }
    }).catch(error => {
      console.log("error creating visit");
    });
  };

  const fetchSchedule = () => {
    axios.get("/api/doctor-schedule/" + doctor, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setSchedule(response.data["hydra:member"]);
      }
    }).catch(error => {
      console.log("error fetching schedule");
    });
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    createVisit();
    fetchSchedule();
  }, [visitDate]);

  return <>
    <ScheduleList schedule={schedule} setVisitDate={setVisitDate} />
  </>;

};

export default ScheduleContainer;