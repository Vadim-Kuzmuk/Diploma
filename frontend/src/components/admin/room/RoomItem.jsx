import React, { useState } from "react";
import { Grid, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ClearIcon from "@mui/icons-material/Clear";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1630px",
  height: "88px"
};

const RoomItem = ({
  room,
  departments,
  newRoom,
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
    number: room.number,
    name: room.name,
    department: room.department.id
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

    sendPatchRequest(room.id, editedData);
    setEditing(false);
    setDisable(false);

  };

  const handleDeleteClick = () => {
    sendDeleteRequest(room.id);
    setEditing(false);
    setDisable(false);
  };

  const handleClearClick = () => {
    setEditing(false);
    setDisable(false);
  };

  const validateData = (data) => {
    switch (false) {
      case isNameValid(data.name):
        return "Назва кабінету повинна містити принаймні 5 символів!";
      case isNumberValid(data.number):
        return "Номер кабінету повинен містити принаймні 1 цифру!";
      default:
        return null;
    }
  };

  const isNameValid = (name) => {
    return name.trim().length >= 5;
  };

  const isNumberValid = (number) => {
    return /^\d+$/.test(number);
  };

  return (
    <Grid container style={containerStyle} spacing={2}>
      <Grid item xs={2}>
        <Typography>{room.id}</Typography>
      </Grid>
      {editing ? (
        <>
          <Grid item xs={1}>
            <TextField
              type="text"
              value={editedData.number}
              onChange={(e) =>
                setEditedData({ ...editedData, number: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              value={editedData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
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
          <Grid item xs={1}>
            <Typography>{room.number}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{room.name}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>{room.department.title + " ( " + room.department.id + " )"}</Typography>
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
  );
};

export default RoomItem;
