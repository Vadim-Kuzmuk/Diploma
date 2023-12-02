import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchFilterData, checkFilterItem } from "../../../utils/fetchFilterData.js";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import DepartmentList from "./DepartmentList";
import { Grid, Pagination, Typography, TextField, Button, FormControl } from "@mui/material";
import InputMask from "react-input-mask";
import Notification from "../../elements/notification/Notification";

const DepartmentContainer = () => {

  const [formData, setFormData] = useState({
    departmentTitle: "",
    departmentPhone: ""
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

  const [departments, setDepartments] = useState(null);
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

  const fetchDepartments = () => {
    let filterUrl = fetchFilterData(filterData);

    navigate(filterUrl);

    axios.get("/api/departments" + filterUrl + "&itemsPerPage=" + paginationInfo.itemsPerPage, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setDepartments(response.data["hydra:member"]);
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

  const sendPatchRequest = (departmentId, editedData) => {

    axios.patch(`/api/departments/${departmentId}`, editedData, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/merge-patch+json"
      }
    }).then((response) => {
      if (response.status === responseStatus.HTTP_OK) {
        fetchDepartments();
      }
    }).catch((error) => {
      console.error("Error updating room:", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    });
  };

  const sendDeleteRequest = (departmentId) => {

    axios.delete(`/api/departments/${departmentId}`, userAuthenticationConfig()).then((response) => {
      if (response.status === responseStatus.HTTP_NO_CONTENT) {
        fetchDepartments();
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
    fetchDepartments();
  }, []);

  const onChangePage = (event, page) => {
    setFilterData({ ...filterData, page: page });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newDepartment = {
      title: formData.departmentTitle,
      phone: formData.departmentPhone
    };

    axios.post(`/api/departments`, newDepartment, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/json"
      }
    }, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_CREATED) {
        fetchDepartments();
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
          Відділи
        </title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Typography variant="h4" component="h1" mb={1}>
        Відділи
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <TextField
              label="Назва відділу"
              value={formData.departmentTitle}
              onChange={(e) => setFormData({ ...formData, departmentTitle: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <FormControl variant="outlined" required>
              <InputMask
                mask="+38(099)-999-99-99"
                maskChar="_"
                id="phone"
                name="phone"
                value={formData.departmentPhone}
                onChange={(e) => setFormData({ ...formData, departmentPhone: e.target.value })}
                required
              >
                {() => <TextField variant="outlined" label="Телефон" />}
              </InputMask>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary">
              Додати відділ
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Typography />
          </Grid>
        </Grid>
      </form>
      <DepartmentList
        departments={departments}
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

export default DepartmentContainer;