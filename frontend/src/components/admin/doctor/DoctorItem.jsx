import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel, Checkbox
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import InputMask from "react-input-mask";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1630px",
  height: "160px",
  backgroundColor: "#e3e3e3",
  borderRadius: "10px",
  marginBottom: "30px"
};

const DoctorItem = ({
  doctor,
  rooms,
  fetchRooms,
  setEditedData,
  editedData,
  notification,
  setNotification,
  sendPatchRequest,
  sendDeleteRequest,
  disable,
  setDisable
}) => {

  const [editing, setEditing] = useState(false);

  const userData = {
    firstName: doctor.user.firstName,
    lastName: doctor.user.lastName,
    phone: doctor.user.phone,
    email: doctor.user.email
  };

  const updatedData = {
    ...editedData,
    grades: doctor.grades,
    consultationPrice: doctor.consultationPrice,
    visitPrice: doctor.visitPrice,
    duration: doctor.duration,
    formats: doctor.formats,
    room: doctor.room.id,
    user: userData
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

    sendPatchRequest(doctor.id, editedData);
    setEditing(false);
    setDisable(false);

  };

  const handleDeleteClick = () => {
    sendDeleteRequest(doctor.id, doctor.user.id);
    setEditing(false);
    setDisable(false);
  };

  const handleClearClick = () => {
    setEditing(false);
    setDisable(false);
  };

  const handleCheckboxChange = (param) => (event) => {
    const checked = event.currentTarget.checked;
    setEditedData((prevData) => ({
      ...prevData,
      formats: {
        ...prevData.formats,
        [param]: checked
      }
    }));
  };

  const validateData = (data) => {
    switch (false) {
      case isValidEmail(data.user.email):
        return "Некоректна адреса електронної пошти!";
      case isGreaterThanZero(data.consultationPrice):
        return "Некоректна ціна консультації!";
      case isGreaterThanZero(data.visitPrice):
        return "Некоректна ціна візиту!";
      case isLessThanSixty(data.duration):
        return "Мінімальна тривалість 10 хвилин і максимальна 60 хвилин!";
      case isNameValid(data.user.firstName):
        return "Мінімальна довжина імені - 3 символи!";
      case isNameValid(data.user.lastName):
        return "Мінімальна довжина фамілії - 3 символи!";
      default:
        return null;
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const isGreaterThanZero = (value) => {
    return parseFloat(value) > 0;
  };

  const isLessThanSixty = (duration) => {
    return duration >= 10 && duration <= 60;
  };

  const isNameValid = (name) => {
    return name.trim().length >= 3;
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Grid container style={containerStyle} spacing={2}>
      <Grid item xs={3}>
        <Typography>{doctor.id}</Typography>
      </Grid>
      {editing ? (
        <>
          <Grid item xs={1}>
            <TextField
              type="text"
              value={editedData.user.lastName}
              onChange={(e) =>
                setEditedData({ ...editedData, user: { ...editedData.user, lastName: e.target.value } })
              }
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              type="text"
              value={editedData.user.firstName}
              onChange={(e) =>
                setEditedData({ ...editedData, user: { ...editedData.user, firstName: e.target.value } })
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
                value={editedData.user.phone}
                onChange={(e) =>
                  setEditedData({ ...editedData, user: { ...editedData.user, phone: e.target.value } })
                }
              >
                {() => <TextField variant="outlined" label="Телефон" />}
              </InputMask>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="outlined"
              id="email"
              type="email"
              label="E-mail"
              name="email"
              value={editedData.user.email}
              onChange={(e) =>
                setEditedData({ ...editedData, user: { ...editedData.user, email: e.target.value } })
              }
            />
          </Grid>
          <Grid item xs={3}>
            <Typography />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              value={editedData.consultationPrice}
              onChange={(e) =>
                setEditedData({ ...editedData, consultationPrice: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              type="text"
              value={editedData.visitPrice}
              onChange={(e) =>
                setEditedData({ ...editedData, visitPrice: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              type="number"
              value={editedData.duration ?? ""}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                if (!isNaN(newDuration)) {
                  setEditedData({ ...editedData, duration: newDuration });
                }
              }}
              InputProps={{ inputProps: { min: 10, max: 60 } }}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editedData.formats.online}
                  onChange={handleCheckboxChange("online")}
                  name="online"
                />
              }
              label="Online"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editedData.formats.offline}
                  onChange={handleCheckboxChange("offline")}
                  name="offline"
                />
              }
              label="Offline"
            />
          </Grid>
          <Grid item xs={1}>
            <FormControl>
              <Select
                id="department-select"
                label="Кабінет"
                value={editedData.room || doctor.room.id}
                onChange={(e) =>
                  setEditedData({ ...editedData, room: e.target.value })
                }
              >
                {rooms && rooms.map((room, key) => (
                  <MenuItem key={room.id} value={room.id}>{room.number}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={1}>
            <Typography>{doctor.user.lastName}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{doctor.user.firstName}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{doctor.user.phone}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{doctor.user.email}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography></Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{doctor.consultationPrice}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{doctor.visitPrice}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{doctor.duration}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              {doctor.formats.offline && "Прийоми"} {doctor.formats.offline && doctor.formats.online && "/"} {doctor.formats.online && "Консультації"}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{doctor.room.number}</Typography>
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
  );
};

export default DoctorItem;
