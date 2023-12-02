import React, { useState } from "react";
import { Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InputMask from "react-input-mask";
import ClearIcon from "@mui/icons-material/Clear";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1500px",
  height: "88px"
};

const DepartmentItem = ({
  department,
  editedData,
  setEditedData,
  sendPatchRequest,
  sendDeleteRequest,
  notification,
  setNotification,
  disable,
  setDisable
}) => {

  const [editing, setEditing] = useState(false);

  const updatedData = {
    ...editedData,
    title: department.title,
    phone: department.phone
  };

  const handleEditClick = () => {
    setEditing(true);
    setDisable(true);
    setEditedData(updatedData);
  };

  const handleSaveClick = () => {

    const validationError = validateData(editedData);

    if (validationError) {
      setNotification({ ...notification, visible: true, type: "error", message: validationError });
      return;
    }
    sendPatchRequest(department.id, editedData);
    setEditing(false);
    setDisable(false);

  };

  const handleDeleteClick = () => {
    sendDeleteRequest(department.id);
    setEditing(false);
    setDisable(false);
  };

  const handleClearClick = () => {
    setEditing(false);
    setDisable(false);
  };

  const validateData = (data) => {
    switch (false) {
      case isNameValid(data.title):
        return "Назва відділення повинна містити принаймні 5 символів!";
      case /^\+38\(0(?!0{2})[0-9]{2}\)-[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(data.phone):
        return "Некоректний номер телефону!";
      default:
        return null;
    }
  };

  const isNameValid = (name) => {
    return name.trim().length >= 5;
  };

  return <>
    <Grid container style={containerStyle} spacing={2}>
      <Grid item xs={3}>
        <Typography>{department.id}</Typography>
      </Grid>
      {editing ? (
        <>
          <Grid item xs={2}>
            <TextField
              type="text"
              value={editedData.title}
              onChange={(e) =>
                setEditedData({ ...editedData, title: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <FormControl variant="outlined" required>
              <InputMask
                mask="+38(099)-999-99-99"
                maskChar="_"
                id="phone"
                name="phone"
                value={editedData.phone}
                onChange={(e) =>
                  setEditedData({ ...editedData, phone: e.target.value })
                }
              >
                {() => <TextField variant="outlined" label="Телефон" />}
              </InputMask>
            </FormControl>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={2}>
            <Typography>{department.title}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{department.phone}</Typography>
          </Grid>
        </>
      )}
      {editing ? (
        <>
          <Grid item xs={1}>
            <Button onClick={handleSaveClick} variant="outlined">
              <DoneOutlinedIcon />
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button onClick={handleClearClick} variant="outlined">
              <ClearIcon />
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button onClick={handleDeleteClick} variant="outlined">
              <DeleteOutlineOutlinedIcon />
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Typography />
          </Grid>
        </>
      ) : (
        <Grid item xs={2}>
          <Button
            onClick={handleEditClick}
            variant="outlined"
            disabled={disable}
          >
            <EditOutlinedIcon />
          </Button>
        </Grid>
      )}
      <Grid item xs={3}>
        <Typography />
      </Grid>
    </Grid>
  </>;
};

export default DepartmentItem;