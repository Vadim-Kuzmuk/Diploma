import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { fetchFilterData, checkFilterItem } from "../../../utils/fetchFilterData.js";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import DoctorList from "./DoctorList";
import { Pagination, Typography, Button } from "@mui/material";
import Notification from "../../elements/notification/Notification";

const DoctorContainer = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [disable, setDisable] = useState(false);

  const [doctors, setDoctors] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  const [filterData, setFilterData] = useState({
    "page": checkFilterItem(searchParams, "page", 1, true),
    "title": checkFilterItem(searchParams, "title", null)
  });

  const fetchDoctors = () => {
    let filterUrl = fetchFilterData(filterData);

    navigate(filterUrl);

    axios.get("/api/doctor-infos" + filterUrl + "&itemsPerPage=" + paginationInfo.itemsPerPage, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setDoctors(response.data["hydra:member"]);
        setPaginationInfo({
          ...paginationInfo,
          totalItems: response.data["hydra:totalItems"],
          totalPageCount: Math.ceil(response.data["hydra:totalItems"] / paginationInfo.itemsPerPage)
        });
      }
    }).catch(error => {
      console.log("error");
    });
  };

  const sendPatchRequest = (doctorId) => {

    axios.patch(`/api/doctor-infos/${doctorId}`, editedData, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/merge-patch+json"
      }
    }).then((response) => {
      if (response.status === responseStatus.HTTP_OK) {
        fetchDoctors();
      }
    }).catch((error) => {
      console.error("Error updating room:", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    });

  };

  const sendDeleteRequest = (doctorId, userId) => {

    axios.delete(`/api/doctor-infos/${doctorId}`, userAuthenticationConfig()).then((response) => {
      if (response.status === responseStatus.HTTP_NO_CONTENT) {
        fetchDoctors();
      }
    }).catch((error) => {
      console.error("Error deleting room:", error);

      if (error.response.status === responseStatus.HTTP_INTERNAL_SERVER_ERROR) {
        setNotification({
          visible: true,
          type: "error",
          message: "Помилка при видаленні лікаря!"
        });
      }
    });

    axios.delete(`/api/users/${userId}`, userAuthenticationConfig()).then((response) => {
      if (response.status === responseStatus.HTTP_NO_CONTENT) {
        fetchDoctors();
      }
    }).catch((error) => {
      console.error("Error deleting room:", error);
    });

  };

  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: null,
    totalPageCount: null,
    itemsPerPage: 5
  });

  useEffect(() => {
    fetchDoctors();
  }, [filterData]);

  const onChangePage = (event, page) => {
    setFilterData({ ...filterData, page: page });
  };

  return (
    <>
      <Helmet>
        <title>
          Лікарі
        </title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Typography variant="h4" component="h1" mb={1}>
          Лікарі
        </Typography>
        <Button
          variant="contained"
          to="/admin-panel/new-doctor"
          component={NavLink}
        >
          Додати лікаря
        </Button>
      </div>
      <DoctorList
        doctors={doctors}
        setEditedData={setEditedData}
        editedData={editedData}
        sendPatchRequest={sendPatchRequest}
        sendDeleteRequest={sendDeleteRequest}
        notification={notification}
        setNotification={setNotification}
        disable={disable}
        setDisable={setDisable}
      />
      {paginationInfo.totalPageCount &&
        <Pagination
          count={paginationInfo.totalPageCount}
          shape="rounded"
          page={filterData.page}
          onChange={(event, page) => onChangePage(event, page)}
        />}
    </>
  );

};

export default DoctorContainer;