import { Helmet } from "react-helmet-async";
import ClientInfo from "./ClientInfo";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";
import { responseStatus } from "../../../utils/consts";
import Notification from "../../elements/notification/Notification";
import { Button, CircularProgress, Divider } from "@mui/material";
import ClientVisitsList from "./ClientVisitsList";

const CabinetContainer = () => {
  const { id } = jwt_decode(localStorage.getItem("token"));

  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [newInfo, setNewInfo] = useState(null);
  const [visits, setVisits] = useState(null);
  const [filterData, setFilterData] = useState({ type: "visits", page: 1 });
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [payId, setPayId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });
  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: 0,
    totalPageCount: 0,
    itemsPerPage: 10,
    page: 1
  });

  const fetchUserInfo = () => {
    setLoading(true);

    axios.get("/api/users/" + id, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data) {
        setUserInfo(response.data);
        fetchUserVisits();
      }
    }).catch(error => {
      console.log("error fetching user data");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні даних!"
      });
    }).finally(() => {setLoading(false);});
  };

  const fetchUserVisits = () => {
    setVisitsLoading(true);

    axios.get("/api/users/" + id + "/" + filterData.type + `?itemsPerPage=${paginationInfo.itemsPerPage}&page=${filterData.page}`, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setVisits(response.data["hydra:member"][1]);
        setPaginationInfo({
          ...paginationInfo,
          totalItems: response.data["hydra:member"][0],
          totalPageCount: Math.ceil(response.data["hydra:member"][0] / paginationInfo.itemsPerPage)
        });
      }
    }).catch(error => {
      console.log("error fetching user visit");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при завантаженні візитів!"
      });
    }).finally(() => {
      setVisitsLoading(false);
    });
  };

  const patchUserInfo = () => {
    if (!newInfo) {
      return;
    }

    setLoading(true);
    axios.patch("/api/users/" + id, newInfo, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data) {
        setUserInfo(response.data);
        setNotification({
          ...notification,
          visible: true,
          type: "success",
          message: "Дані успішно оновлено!"
        });
      }
    }).catch(error => {
      console.log("error patching user data");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при зміні даних!"
      });
    }).finally(() => {setLoading(false);});
  };

  const payVisit = () => {
    if (!payId) {
      return;
    }

    axios.patch("/api/visits/" + payId, { isPaid: true }, userAuthenticationConfig()).then(response => {
      fetchUserVisits();
      setNotification({
        ...notification,
        visible: true,
        type: "success",
        message: "Консультацію успішно оплачено!"
      });
    }).catch(error => {
      console.log("error paying visit");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при оплаті консультації!"
      });
    }).finally(() => {setPayId(null);});
  };

  const cancelVisit = () => {
    if (!cancelId) {
      return;
    }

    axios.delete("/api/visits/" + cancelId, userAuthenticationConfig()).then(response => {
      fetchUserVisits();
      setNotification({
        ...notification,
        visible: true,
        type: "success",
        message: "Запис скасовано!"
      });
    }).catch(error => {
      console.log(error);
      console.log("error paying visit");
      setNotification({
        ...notification,
        visible: true,
        type: "error",
        message: "Помилка при скасування запису!"
      });
    }).finally(() => {setCancelId(null);});
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchUserVisits();
  }, [filterData]);

  useEffect(() => {
    patchUserInfo();
  }, [newInfo]);

  useEffect(() => {
    payVisit();
  }, [payId]);

  useEffect(() => {
    cancelVisit();
  }, [cancelId]);

  return (
    <>
      <Helmet>
        <title>
          Кабінет пацієнта
        </title>
      </Helmet>
      {notification.visible &&
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      }
      {loading &&
        <div style={{ marginTop: "15px", width: "100%", display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      }
      {!loading && <>
        <ClientInfo
          userInfo={userInfo}
          setEditedInfo={setNewInfo}
          setNotificaiton={setNotification}
          notification={notification}
        />
        <Divider style={{ margin: "20px auto 10px auto" }} />
        <div style={{ width: "max-content", display: "flex", gap: "5px", margin: "10px auto" }}>
          <Button
            disabled={visitsLoading}
            variant={filterData.type === "visits" ? "outlined" : "contained"}
            onClick={() => {setFilterData({ type: "visits", page: 1 });}}
          >
            Майбутні записи
          </Button>
          <Button
            disabled={visitsLoading}
            variant={filterData.type === "history" ? "outlined" : "contained"}
            onClick={() => {setFilterData({ type: "history", page: 1 });}}
          >
            Історія записів
          </Button>
        </div>
        {visitsLoading &&
          <div style={{ marginTop: "15px", width: "100%", display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        }
        {!visitsLoading && <ClientVisitsList
          visits={visits}
          setPayId={setPayId}
          paginationInfo={paginationInfo}
          filterData={filterData}
          setFilterData={setFilterData}
          setCancelId={setCancelId}
        />}
      </>
      }
    </>
  );
};

export default CabinetContainer;