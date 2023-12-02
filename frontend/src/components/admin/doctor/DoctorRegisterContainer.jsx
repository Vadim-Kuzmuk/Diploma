import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Notification from "../../elements/notification/Notification";
import { AppContext } from "../../../App";
import DoctorRegisterForm from "./DoctorRegisterForm";
import { fetchFilterData } from "../../../utils/fetchFilterData";
import axios from "axios";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";
import { responseStatus } from "../../../utils/consts";

const DoctorRegisterContainer = () => {
    const navigate = useNavigate();

    const { setAuthenticated, authenticated } = useContext(AppContext);

    const [registerData, setRegisterData] = useState(null);
    const [specialities, setSpecialities] = useState(null);
    const [rooms, setRooms] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
      visible: false,
      type: "",
      message: ""
    });

    const fetchSpecialities = () => {
      setSpecialities(null);
      setLoading(true);
      axios.get("/api/specialities", userAuthenticationConfig()).then(response => {
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

    const fetchRooms = () => {
      setRooms(null);
      setLoading(true);
      axios.get("/api/rooms", userAuthenticationConfig()).then(response => {
        if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
          setRooms(response.data["hydra:member"]);
        }
      }).catch(error => {
        console.log("error fetching rooms");
        setNotification({
          ...notification,
          visible: true,
          type: "error",
          message: "Помилка при завантаженні спеціальностей!"
        });
      }).finally(() => setLoading(false));
    };

    const registerDoctor = () => {
      if (!registerData) {
        console.log("no data for register");
        return;
      }

      setLoading(true);

      axios.post(`/api/create-doctor`, {
        ...registerData,
        birthday: registerData.user.birthday.toString()
      }, userAuthenticationConfig()).then(response => {
        navigate("/admin-panel");
        setNotification({
          ...notification,
          visible: true,
          type: "success",
          message: "Лікаря успішно зареєстровано!"
        });
      }).catch(error => {
        setError(error.response.data.message);
        console.log(error.response);
        const message = error.response.data.detail?.includes("Duplicate entry") ? "Така адреса електроної пошти вже зареєстрована!" : error.response.data.detail;
        setNotification({ ...notification, visible: true, type: "error", message: message });
      }).finally(() => setLoading(false));
    };

    useEffect(() => {
      fetchSpecialities();
      fetchRooms();
    }, []);

    useEffect(() => {
      registerDoctor();
    }, [registerData]);

    return (
      <>
        {notification.visible &&
          <Notification
            notification={notification}
            setNotification={setNotification}
          />
        }
        <Helmet>
          <title>
            Реєстрація Лікаря
          </title>
        </Helmet>
        <DoctorRegisterForm
          specialities={specialities}
          rooms={rooms}
          notification={notification}
          setNotification={setNotification}
          setRegisterData={setRegisterData}
          loading={loading}
        />
      </>
    );
  }
;

export default DoctorRegisterContainer;
