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

const WorkItem = ({
  work,
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
    title: work.title,
    hours: work.hours,
    seconds: work.seconds,
    created: work.created
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
    sendPatchRequest(work.id, editedData);
    setEditing(false);
    setDisable(false);

  };

  const handleDeleteClick = () => {
    sendDeleteRequest(work.id);
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
        return "Назва проекту повинна містити принаймні 3 символів!";
      default:
        return null;
    }
  };

  const isNameValid = (name) => {
    return name.trim().length >= 3;
  };

  return <>
    <Grid container style={containerStyle} spacing={2}>
      <Grid item xs={3}>
        <Typography>{work.id}</Typography>
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
          <Grid item xs={1}>
            <TextField
              type="text"
              value={editedData.hours}
              onChange={(e) => {
                const numericWithCommaRegex = /^\d*(\.\d{0,2})?$/;
                if (numericWithCommaRegex.test(e.target.value)) {
                  setEditedData({ ...editedData, hours: e.target.value });
                }
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              type="text"
              value={editedData.seconds}
              onChange={(e) => {
                const numericRegex = /^\d+$/;
                if (numericRegex.test(e.target.value)) {
                  const secondsValue = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                  setEditedData({ ...editedData, seconds: secondsValue });
                }
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              value={editedData.created}
              onChange={(e) =>
                setEditedData({ ...editedData, created: e.target.value })
              }
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={2}>
            <Typography>{work.title}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{work.hours}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{work.seconds}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{work.created}</Typography>
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
        <Grid item xs={3}>
          <Button
            onClick={handleEditClick}
            variant="outlined"
            disabled={disable}
          >
            <EditOutlinedIcon />
          </Button>
        </Grid>
      )}
    </Grid>
  </>;
};

export default WorkItem;