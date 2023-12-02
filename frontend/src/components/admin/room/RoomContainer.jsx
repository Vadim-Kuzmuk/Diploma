import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchFilterData, checkFilterItem } from "../../../utils/fetchFilterData.js";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import RoomList from "./RoomList";
import {
  Grid,
  Pagination,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import Notification from "../../elements/notification/Notification";

const RoomContainer = () => {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomName: "",
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

  const [rooms, setRooms] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  const [newRoom, setNewRoom] = useState({
    number: "",
    name: "",
    department: ""
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

  const fetchProducts = () => {
    let filterUrl = fetchFilterData(filterData);
    navigate(filterUrl);

    axios.get("/api/rooms" + filterUrl + "&itemsPerPage=" + paginationInfo.itemsPerPage, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setRooms(response.data["hydra:member"]);
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

  const sendPatchRequest = (roomId, editedData) => {

    axios.patch(`/api/rooms/${roomId}`, editedData, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/merge-patch+json"
      }
    }).then((response) => {
      if (response.status === responseStatus.HTTP_OK) {
        fetchProducts();
      }
    }).catch((error) => {
      console.error("Error updating room:", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    });
  };

  const sendDeleteRequest = (roomId) => {

    axios.delete(`/api/rooms/${roomId}`, userAuthenticationConfig()).then((response) => {
      if (response.status === responseStatus.HTTP_NO_CONTENT) {
        fetchProducts();
      }
    }).catch((error) => {
      console.error("Error deleting room:", error);

      if (error.response.status === responseStatus.HTTP_INTERNAL_SERVER_ERROR) {
        setNotification({
          visible: true,
          type: "error",
          message: "Помилка: деякі лікарі прив'язані до цього кабінету!"
        });
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.post(`/api/rooms`, newRoom, {
      headers: {
        ...userAuthenticationConfig().headers,
        "Content-Type": "application/json"
      }
    }, userAuthenticationConfig()).then((response) => {
      if (response.status === responseStatus.HTTP_CREATED) {
        fetchProducts();
        clearFormFields();
        setFilterData({ ...filterData, page: 1 });

        setNewRoom({
          number: "",
          name: "",
          department: ""
        });
      }
    }).catch((error) => {
      console.error("Error creating a new product:", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    });
  };

  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: null,
    totalPageCount: null,
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchProducts();
  }, [filterData]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onChangePage = (event, page) => {
    setFilterData({ ...filterData, page: page });
  };

  return (
    <>
      <Helmet>
        <title>
          Кабінети
        </title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Typography variant="h4" component="h1" mb={1}>
        Кабінети
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <TextField
              label="Номер"
              value={newRoom.number}
              onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Назва"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
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
                value={newRoom.department}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    department: e.target.value !== "any" ? e.target.value : null
                  })
                }
                required
              >
                {departments &&
                  departments.map((dep, key) => (
                    <MenuItem key={dep.id} value={dep.id}>
                      {dep.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary">
              Додати кабінет
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Typography />
          </Grid>
        </Grid>
      </form>
      <RoomList
        rooms={rooms}
        fetchProducts={fetchProducts}
        newRoom={newRoom}
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

export default RoomContainer;
