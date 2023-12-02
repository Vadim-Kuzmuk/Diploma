import React from "react";
import {
  Button, CircularProgress,
  FormControl, FormControlLabel, FormLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel, MenuItem, Radio, RadioGroup, Select,
  TextField,
  Typography
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputMask from "react-input-mask";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import uk from "date-fns/locale/uk";
import { dateToTimestamp } from "../../../utils/timestampUtil";

const DoctorRegisterForm = ({ rooms, specialities, setRegisterData, notification, setNotification, loading }) => {
  const [info, setInfo] = React.useState({
    email: null,
    sex: null,
    firstName: null,
    lastName: null,
    phone: null,
    birthday: null,
    room: null,
    speciality: null
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [pass, setPass] = React.useState({ valid: false, confirmed: false, value1: null, value2: null });

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = false, errorMessage;
    const passConfirmed = confirmPassword(pass.value1, pass.value2);
    const passValid = validatePassword(pass.value1);
    setPass({
      ...pass,
      valid: passValid,
      confirmed: passConfirmed
    });

    switch (false) {
      case /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(info.email):
        errorMessage = "Некоректна адреса електроної пошти!";
        break;
      case passValid:
        errorMessage = "Некоректний пароль!";
        break;
      case passConfirmed:
        errorMessage = "Підтвердіть пароль!";
        break;
      case /^\+38\(0(?!0{2})[0-9]{2}\)-[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(info.phone):
        errorMessage = "Некоректний номер телефону!";
        break;
      case /^(?!\s*$).+/.test(info.firstName) && info.firstName !== null:
        errorMessage = "Введіть імʼя!";
        break;
      case /^(?!\s*$).+/.test(info.lastName) && info.lastName !== null:
        errorMessage = "Введіть прізвище!";
        break;
      case info.sex !== null:
        errorMessage = "Оберіть стать!";
        break;
      case info.birthday !== null:
        errorMessage = "Вкажіть дату народження!";
        break;
      case info.speciality !== null:
        errorMessage = "Вкажіть спеціальність!";
        break;
      case info.room !== null:
        errorMessage = "Вкажіть кабінет!";
        break;
      default:
        valid = true;
        break;
    }

    if (!valid) {
      setNotification({ ...notification, visible: true, type: "error", message: errorMessage });
      return;
    }

    setRegisterData({
      user: {
        email: info.email,
        plainPassword: pass.value1,
        phone: info.phone,
        firstName: info.firstName,
        lastName: info.lastName,
        sex: info.sex,
        birthday: info.birthday,
        address: { "address": "json" },
        registration: { "address": "json" },
        passport: "000000000"
      },
      doctorInfo: {
        room: info.room.id,
        speciality: info.speciality.id
      }
    });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChangePassword = (e) => {
    setPass({
      ...pass,
      value1: e.target.value,
      valid: validatePassword(e.target.value)
    });
  };

  const handleConfirmPassword = (e) => {
    setPass({
      ...pass,
      value2: e.target.value,
      confirmed: validatePassword(pass.value1, e.target.value)
    });
  };

  const validatePassword = (password) => {
    return (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password));
  };

  const confirmPassword = (password, confirmation) => {
    return password === confirmation && confirmation !== "" && confirmation !== null;
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <Typography
        align="center"
        variant="h4"
      >
        Реєстрація лікаря
      </Typography>
      <TextField
        variant="standard"
        id="email"
        type="email"
        label="E-mail"
        name="email"
        value={info.email}
        onChange={(e) => {setInfo({ ...info, email: e.target.value });}}
        required
      />
      <FormControl variant="standard" required>
        <InputLabel htmlFor="standard-adornment-password">Пароль</InputLabel>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          error={!pass.valid}
          onChange={handleChangePassword}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <Typography
          type="overline"
          sx={{ mt: 1, color: "#d32f2f" }}
          display={pass.valid ? "none" : "block"}
        >
          Пароль має складатися з хоча б одної великої та маленької латинських літер, цифри і має бути не коротше 8
          символів!
        </Typography>
      </FormControl>
      <FormControl variant="standard" required>
        <InputLabel htmlFor="standard-adornment-password">Підтвердіть пароль</InputLabel>
        <Input
          type="password"
          id="password-confirm"
          name="password-confirm"
          error={!pass.confirmed}
          onChange={handleConfirmPassword}
        />
        <Typography
          type="overline"
          sx={{ mt: 1, color: "#d32f2f" }}
          display={pass.confirmed ? "none" : "block"}
        >
          Введені паролі мають співпадати!
        </Typography>
      </FormControl>
      <FormControl variant="standard" required>
        <InputMask
          mask="+38(099)-999-99-99"
          maskChar="_"
          id="phone"
          name="phone"
          value={info.phone}
          onChange={(e) => {setInfo({ ...info, phone: e.target.value });}}
        >
          {() => <TextField variant="standard" label="Телефон" />}
        </InputMask>
      </FormControl>
      <TextField
        variant="standard"
        id="firstName"
        type="text"
        label="Імʼя"
        name="firstName"
        value={info.firstName}
        onChange={(e) => {setInfo({ ...info, firstName: e.target.value });}}
        required
      />
      <TextField
        variant="standard"
        id="lastName"
        type="text"
        label="Прізвище"
        name="lastName"
        value={info.lastName}
        onChange={(e) => {setInfo({ ...info, lastName: e.target.value });}}
        required
      />
      <FormControl variant="standard" required>
        <FormLabel>Стать</FormLabel>
        <RadioGroup
          row
          name="sex"
          id="sex"
          value={info.sex}
          onChange={(e) => {setInfo({ ...info, sex: e.target.value });}}
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
          onChange={(date) => {setInfo({ ...info, birthday: dateToTimestamp(date) });}}
        />
      </LocalizationProvider>
      <FormControl
        required
        disabled={loading}
      >
        <InputLabel id="department-select-label">Спеціальність</InputLabel>
        <Select
          labelId="department-select-label"
          id="department-select"
          label="Спеціальність"
          value={info.speciality}
          onChange={(e) => {setInfo({ ...info, speciality: e.target.value });}}
        >
          {specialities && specialities.map((spec, key) => (
            <MenuItem value={spec}>{spec.title}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        required
        disabled={loading}
      >
        <InputLabel id="department-select-label">Кабінет</InputLabel>
        <Select
          labelId="department-select-label"
          id="department-select"
          label="Кабінет"
          value={info.room}
          onChange={(e) => {setInfo({ ...info, room: e.target.value });}}
        >
          {rooms && rooms.map((room, key) => (
            <MenuItem value={room}>{room.number} ({room.name})</MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading &&
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}><CircularProgress /></div>}
      {!loading && <Button
        variant="contained"
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        Зареєструвати лікаря
      </Button>}
    </form>
  );
};

export default DoctorRegisterForm;