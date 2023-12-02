import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import SpecialityList from "./SpecialityList";
import userAuthenticationConfig from "../../utils/userAuthenticationConfig";
import { responseStatus } from "../../utils/consts";
import axios from "axios";
import { checkFilterItem, fetchFilterData } from "../../utils/fetchFilterData";
import { useNavigate, useSearchParams } from "react-router-dom";
import DoctorList from "./DoctorList";
import AppointForm from "./AppointForm";
import Notification from "../elements/notification/Notification";
import { AppContext } from "../../App";

const HomeContainer = () => {
  const { timeZone } = useContext(AppContext);
  const [departments, setDepartments] = useState(null);
  const [department, setDepartment] = useState(null);
  const [specialities, setSpecialities] = useState(null);
  const [speciality, setSpeciality] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [days, setDays] = useState(null);
  const [day, setDay] = useState(null);
  const [visitInfo, setVisitInfo] = useState(null);
  const [visitLoading, setVisitLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [appointModalOpen, setAppointModalOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    "title": checkFilterItem(searchParams, "title", null)
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  const fetchDepartments = () => {
    setLoading(true);
    axios.get("/api/departments", userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setDepartments(response.data["hydra:member"]);
      }
    }).catch(error => {
      console.log("error fetching departments");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні відділів!"
      });
    }).finally(() => setLoading(false));
  };

  const fetchSpecialities = () => {
    let filterUrl = fetchFilterData(filterData);
    navigate(filterUrl);

    setSpeciality(null);
    setLoading(true);
    axios.get("/api/specialities" + filterUrl, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setSpecialities(response.data["hydra:member"]);
      }
    }).catch(error => {
      console.log("error fetching specialities");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні спеціальностей!"
      });
    }).finally(() => setLoading(false));
  };

  const fetchSpecialitiesForDepartment = () => {
    if (department === null) {
      fetchSpecialities();
      return;
    }

    setSpeciality(null);
    setLoading(true);
    axios.get("/api/departments/" + department.id, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data) {
        setSpecialities(response.data.specialities);
      }
    }).catch(error => {
      console.log("error fetching specialities for department");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні спеціальностей!"
      });
    }).finally(() => setLoading(false));
  };

  const fetchDoctors = () => {
    if (!speciality) {
      return;
    }

    setDoctor(null);
    setDoctorInfo(null);
    setLoading(true);
    axios.get("/api/specialities/" + speciality.id, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data) {
        setDoctors(response.data.doctors);
      }
    }).catch(error => {
      console.log("error fetching doctors");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні лікарів!"
      });
    }).finally(() => setLoading(false));
  };

  const fetchDoctor = () => {
    if (!doctor) return;

    axios.get("/api/doctor-infos/" + doctor.id, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data) {
        setDoctorInfo(response.data);
      }
    }).catch(error => {
      console.log("error fetching doctor info");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні інформації про лікаря!"
      });
    });
  };

  const fetchScheduleDays = () => {
    if (!doctor) return;

    axios.get("/api/doctor-schedule/" + doctor.user.id, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setDays(response.data["hydra:member"]);
      }
    }).catch(error => {
      console.log("error fetching schedule days");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні розкладу!"
      });
    });
  };

  const fetchSchedule = () => {
    if (!doctor || !day) return;

    axios.get("/api/doctor-schedule/" + doctor.user.id + "/" + day, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setSchedule(response.data["hydra:member"]);
      }
    }).catch(error => {
      console.log("error fetching schedule");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні розкладу!"
      });
    });
  };

  const createVisit = () => {
    if (!visitInfo) return;

    setVisitLoading(true);
    axios.post("api/visits", { ...visitInfo, date: visitInfo.date.toString() }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (responseStatus.HTTP_CREATED) {
        setNotification({
          ...notification,
          visible: true,
          type: "success",
          message: "Запис успішно створено!"
        });
      }
    }).catch(error => {
      console.log(error);
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка! Перевірте дані або спробуйте пізніше"
      });
    }).finally(() => {
      setVisitInfo(null);
      setVisitLoading(false);
      setAppointModalOpen(false);
      fetchSchedule();
    });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchSpecialitiesForDepartment();
  }, [department]);

  useEffect(() => {
    fetchSpecialities();
    setDepartment(null);
  }, [filterData]);

  useEffect(() => {
    fetchDoctors();
  }, [speciality]);

  useEffect(() => {
    fetchDoctor();
    fetchScheduleDays();
    setSchedule(null);
  }, [doctor]);

  useEffect(() => {
    fetchSchedule();
    setSchedule(null);
  }, [day]);

  useEffect(() => {
    createVisit();
  }, [visitInfo]);

  return (
    <>
      <Helmet>
        <title>
          Головна
        </title>
      </Helmet>
      {notification.visible &&
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      }
      <div
        style={{
          position: "absolute",
          margin: "-25px",
          width: "100vw",
          height: "calc(100vh - 60px)",
          zIndex: "100",
          display: "flex",
          flexDirection: "row"
        }}
      >
        <SpecialityList
          departments={departments}
          department={department}
          setDepartment={setDepartment}
          filterData={filterData}
          setFilterData={setFilterData}
          specialities={specialities}
          setSpeciality={setSpeciality}
          loading={loading}
        />
        <DoctorList
          department={department}
          doctors={doctors}
          setDoctor={setDoctor}
          speciality={speciality}
          loading={loading}
        />
        <AppointForm
          doctor={doctorInfo}
          days={days}
          day={day}
          setDay={setDay}
          schedule={schedule}
          setVisitInfo={setVisitInfo}
          visitLoading={visitLoading}
          appointModalOpen={appointModalOpen}
          setAppointModalOpen={setAppointModalOpen}
        />
      </div>
    </>
  );

};

export default HomeContainer;