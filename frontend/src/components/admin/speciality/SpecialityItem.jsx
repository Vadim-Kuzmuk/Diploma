import React, { useState } from "react";
import { Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ClearIcon from "@mui/icons-material/Clear";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1500px",
  height: "88px"
};

const SpecialityItem = ({
  speciality,
  editedData,
  setEditedData,
  sendPatchRequest,
  sendDeleteRequest,
  departments,
  notification,
  setNotification,
  disable,
  setDisable
}) => {

  const [editing, setEditing] = useState(false);

  const updatedData = {
    ...editedData,
    title: speciality.title,
    department: speciality.department.id
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

    sendPatchRequest(speciality.id, editedData);
    setEditing(false);
    setDisable(false);

  };

  const handleDeleteClick = () => {
    sendDeleteRequest(speciality.id);
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
        return "Назва спеціальності повинна містити принаймні 5 символів!";
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
        <Typography>{speciality.id}</Typography>
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
          <Grid item xs={4}>
            <FormControl>
              <Select
                value={editedData.department}
                onChange={(e) =>
                  setEditedData({ ...editedData, department: e.target.value })
                }
              >
                {departments &&
                  departments.map((dep, key) => (
                    <MenuItem key={dep.id} value={dep.id}>
                      {`${dep.title} ( ${dep.id} )`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={2}>
            <Typography>{speciality.title}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>{speciality.department.title + " ( " + speciality.department.id + " )"}</Typography>
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
          <Grid item xs={1}>
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
      <Grid item xs={1}>
        <Typography />
      </Grid>
    </Grid>
  </>;
};

export default SpecialityItem;