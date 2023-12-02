import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@mui/material";
import { dateToTimestamp, timestampToDate } from "../../../utils/timestampUtil";
import { ClearOutlined, DoneOutlined, EditOutlined } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import uk from "date-fns/locale/uk";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import InputMask from "react-input-mask";
import { NavLink } from "react-router-dom";


const ClientInfo = ({ userInfo, setNotificaiton, notification, setEditedInfo }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newInfo, setNewInfo] = useState(null);

  const birthdayFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const handleEditSubmit = (e) => {
    if (!newInfo) {
      setEditing(false);
      return;
    }

    let valid = false, errorMessage;

    switch (true) {
      case (newInfo.hasOwnProperty("phone") && !(/^\+38\(0(?!0{2})[0-9]{2}\)-[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(newInfo.phone))):
        errorMessage = "Некоректний номер телефону!";
        break;
      case (newInfo.hasOwnProperty("firstName") && !(/^(?!\s*$).+/.test(newInfo.firstName))):
        errorMessage = "Введіть імʼя!";
        break;
      case (newInfo.hasOwnProperty("lastName") && !(/^(?!\s*$).+/.test(newInfo.lastName))):
        errorMessage = "Введіть прізвище!";
        break;
      default:
        valid = true;
        break;
    }

    if (!valid) {
      setNotificaiton({ ...notification, visible: true, type: "error", message: errorMessage });
      return;
    }

    setEditedInfo(newInfo);
    setEditing(false);
  };

  return <>
    <div style={{ maxWidth: "1000px", margin: "auto" }}>
      {userInfo && !editing && <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" style={{ marginBottom: "10px" }}>
            <b>Вітаємо, {userInfo.firstName} {userInfo.lastName} !</b>
          </Typography>
          <Button onClick={() => {setEditing(true);}}>
            <EditOutlined fontSize="large" />
          </Button>
        </div>
        <Typography variant="h6">
          Персональна інформація:
        </Typography>
        <Typography variant="h6">
          <b>Стать:</b> {userInfo.sex === "m" ? "Чоловіча" : "Жіноча"}
        </Typography>
        <Typography variant="h6">
          <b>Дата
             народження:</b> {Intl.DateTimeFormat(["uk-UA"], birthdayFormatOptions).format(timestampToDate(userInfo.birthday))}
        </Typography>
        <Typography variant="h6">
          <b>Електронна пошта:</b> {userInfo.email}
        </Typography>
        <Typography variant="h6">
          <b>Телефон:</b> {userInfo.phone}
        </Typography>
      </>}
      {userInfo && editing && <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h3" style={{ marginBottom: "10px" }}>
            <b>Налаштування профілю</b>
          </Typography>
          <div>
            <Button
              color="success" onClick={handleEditSubmit}
            >
              <DoneOutlined fontSize="large" />
            </Button>
            <Button
              color="error" onClick={() => {
              setNewInfo(null);
              setEditing(false);
            }}
            >
              <ClearOutlined fontSize="large" />
            </Button>
          </div>
        </div>
        <div
          style={{ width: "400px", display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <Typography variant="h6">
            Персональна інформація:
          </Typography>
          <TextField
            variant="standard"
            id="firstName"
            type="text"
            label="Імʼя"
            name="firstName"
            value={newInfo?.firstName !== undefined ? newInfo.firstName : userInfo.firstName}
            onChange={(e) => {
              setNewInfo({ ...newInfo, firstName: e.target.value });
            }}
          />
          <TextField
            variant="standard"
            id="lastName"
            type="text"
            label="Прізвище"
            name="lastName"
            value={newInfo?.lastName !== undefined ? newInfo.lastName : userInfo.lastName}
            onChange={(e) => {
              setNewInfo({ ...newInfo, lastName: e.target.value });
            }}
          />
          <FormControl variant="standard">
            <FormLabel>Стать</FormLabel>
            <RadioGroup
              row
              name="sex"
              id="sex"
              value={newInfo?.sex || userInfo.sex}
              onChange={(e) => {setNewInfo({ ...newInfo, sex: e.target.value });}}
            >
              <FormControlLabel value="m" control={<Radio />} label="Чоловіча" />
              <FormControlLabel value="f" control={<Radio />} label="Жіноча" />
            </RadioGroup>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={uk}>
            <DatePicker
              label="Дата народження"
              minDate="-2208988800"
              disableFuture
              value={(newInfo?.birthday && timestampToDate(newInfo?.birthday)) || timestampToDate(userInfo.birthday)}
              onChange={(date) => {setNewInfo({ ...newInfo, birthday: dateToTimestamp(date) });}}
            />
          </LocalizationProvider>
          <FormControl variant="standard" required>
            <InputMask
              mask="+38(099)-999-99-99"
              maskChar="_"
              id="phone"
              name="phone"
              value={newInfo?.phone || userInfo.phone}
              onChange={(e) => {setNewInfo({ ...newInfo, phone: e.target.value });}}
            >
              {() => <TextField variant="standard" label="Телефон" />}
            </InputMask>
          </FormControl>
          <Button
            variant="text"
            to="/cabinet/change-password"
            component={NavLink}
          >
            Змінити пароль
          </Button>
        </div>
      </>
      }
    </div>
  </>;
  ;
};
;

export default ClientInfo;


