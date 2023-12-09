import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchFilterData, checkFilterItem } from "../../../utils/fetchFilterData.js";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import WorkList from "./WorkList";
import { Grid, Pagination, Typography, TextField, Button, FormControl } from "@mui/material";
import InputMask from "react-input-mask";
import Notification from "../../elements/notification/Notification";
import jwt_decode from "jwt-decode";

const WorkContainer = () => {

  const [formData, setFormData] = useState({
    workTitle: "",
    workSeconds: "",
    workHours: ""
  });

  const clearFormFields = () => {
    const clearedFormData = Object.fromEntries(
      Object.keys(formData).map(key => [key, ""])
    );
    setFormData(clearedFormData);
  };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [disable, setDisable] = useState(false);

  const [works, setWorks] = useState(null);
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

  const fetchWorks = () => {
    let filterUrl = fetchFilterData(filterData);

    navigate(filterUrl);

    axios.get("/api/works" + filterUrl + "&itemsPerPage=" + paginationInfo.itemsPerPage, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setWorks(response.data["hydra:member"]);
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

  const sendPatchRequest = (workId, editedData) => {

    axios.patch(`/api/works/${workId}`, editedData, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/merge-patch+json"
      }
    }).then((response) => {
      if (response.status === responseStatus.HTTP_OK) {
        fetchWorks();
      }
    }).catch((error) => {
      console.error("Error updating room:", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    });
  };

  const sendDeleteRequest = (workId) => {

    axios.delete(`/api/works/${workId}`, userAuthenticationConfig()).then((response) => {
      if (response.status === responseStatus.HTTP_NO_CONTENT) {
        fetchWorks();
      }
    }).catch((error) => {
      console.error("Error deleting room:", error);

      if (error.response.status === responseStatus.HTTP_INTERNAL_SERVER_ERROR) {
        setNotification({
          visible: true,
          type: "error",
          message: "Помилка: деякі спеціальності прив'язані до цього відділу!"
        });
      }
    });
  };

  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: null,
    totalPageCount: null,
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchWorks();
  }, [filterData.page]);

  const onChangePage = (event, page) => {
    setFilterData({ ...filterData, page: page });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { id: doctorId } = jwt_decode(localStorage["token"]);

    const newWork = {
      title: formData.workTitle,
      seconds: formData.workSeconds,
      hours: formData.workHours,
      user: {
        id: doctorId,
      },
    };

    console.log("Data to be sent:", newWork);

    axios.post(`/api/works`, newWork, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/json"
      }
    }, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_CREATED) {
        fetchWorks();
        clearFormFields();
        setFilterData({ ...filterData, page: 1 });
      }
    }).catch(error => {
      console.error("Error creating a new product:", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    });
  };

  return (
    <>
      <Helmet>
        <title>
          Звітність
        </title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Typography variant="h4" component="h1" mb={1}>
        Звітність
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <TextField
              label="Назва проекту"
              value={formData.workTitle}
              onChange={(e) => setFormData({ ...formData, workTitle: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Кількість годин"
              value={formData.workHours}
              onChange={(e) => {
                const numericWithCommaRegex = /^\d*(\.\d{0,2})?$/;
                if (numericWithCommaRegex.test(e.target.value)) {
                  setFormData({ ...formData, workHours: e.target.value });
                }
              }}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Кількість секунд"
              value={formData.workSeconds}
              onChange={(e) => {
                const numericRegex = /^\d+$/;
                if (numericRegex.test(e.target.value)) {
                  const secondsValue = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                  setFormData({ ...formData, workSeconds: secondsValue });
                }
              }}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary">
              Додати запис
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Typography />
          </Grid>
        </Grid>
      </form>
      <WorkList
        works={works}
        sendPatchRequest={sendPatchRequest}
        sendDeleteRequest={sendDeleteRequest}
        editedData={editedData}
        setEditedData={setEditedData}
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

export default WorkContainer;