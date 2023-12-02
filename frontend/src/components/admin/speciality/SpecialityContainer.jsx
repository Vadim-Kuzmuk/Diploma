import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchFilterData, checkFilterItem } from "../../../utils/fetchFilterData.js";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import SpecialityList from "./SpecialityList";
import {
  Grid,
  Pagination,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import Notification from "../../elements/notification/Notification";

const SpecialityContainer = () => {

  const [formData, setFormData] = useState({
    specialityTitle: "",
    departmentTitle: ""
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

  const [specialities, setSpecialities] = useState(null);
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
    axios.get("/api/departments", userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setDepartments(response.data["hydra:member"]);
      }
    }).catch(error => {
      console.log("error fetching departments");
    });
  };

  const fetchSpecialities = () => {
    let filterUrl = fetchFilterData(filterData);

    navigate(filterUrl);

    axios.get("/api/specialities" + filterUrl + "&itemsPerPage=" + paginationInfo.itemsPerPage, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setSpecialities(response.data["hydra:member"]);
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

  const sendPatchRequest = (specialityId, editedData) => {

    axios.patch(`/api/specialities/${specialityId}`, editedData, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/merge-patch+json"
      }
    }).then((response) => {
      if (response.status === responseStatus.HTTP_OK) {
        fetchSpecialities();
      }
    }).catch((error) => {
      console.error("Error updating room:", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    });
  };

  const sendDeleteRequest = (specialityId) => {

    axios.delete(`/api/specialities/${specialityId}`, userAuthenticationConfig()).then((response) => {
      if (response.status === responseStatus.HTTP_NO_CONTENT) {
        fetchSpecialities();
      }
    }).catch((error) => {
      console.error("Error deleting room:", error);

      if (error.response.status === responseStatus.HTTP_INTERNAL_SERVER_ERROR) {
        setNotification({
          visible: true,
          type: "error",
          message: "Помилка: деякі лікарі прив'язані до цієї спеціальності!"
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
    fetchSpecialities();
  }, [filterData]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onChangePage = (event, page) => {
    setFilterData({ ...filterData, page: page });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newSpeciality = {
      title: formData.specialityTitle,
      department: formData.departmentTitle
    };

    axios.post(`/api/specialities`, newSpeciality, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/json"
      }
    }, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_CREATED) {
        fetchSpecialities();
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
          Спеціальності
        </title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Typography variant="h4" component="h1" mb={1}>
        Спеціальності
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <TextField
              label="Назва спеціальності"
              value={formData.specialityTitle}
              onChange={(e) => setFormData({ ...formData, specialityTitle: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{ margin: "10px 15px", minWidth: "250px" }}>
              <InputLabel id="department-select-label">Відділ</InputLabel>
              <Select
                labelId="department-select-label"
                id="department-select"
                label="Відділ"
                value={formData.departmentTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  departmentTitle: e.target.value !== "any" ? e.target.value : null
                })}
                required
              >
                {departments && departments.map((dep, key) => (
                  <MenuItem key={dep.id} value={dep.id}>{dep.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button type="submit" variant="contained" color="primary">
              Додати спеціальність
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Typography />
          </Grid>
        </Grid>
      </form>
      <SpecialityList
        specialities={specialities}
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

export default SpecialityContainer;