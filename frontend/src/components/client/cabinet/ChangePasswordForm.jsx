import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePasswordForm = ({ setPasswords, setNotification, notification, loading }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [pass, setPass] = React.useState({ old: null, valid: true, confirmed: true, value1: null, value2: null });

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
      case pass.old !== null && pass.old.length >= 8:
        errorMessage = "Введіть поточний пароль!";
        break;
      case passValid:
        errorMessage = "Некоректний пароль!";
        break;
      case passConfirmed:
        errorMessage = "Підтвердіть пароль!";
        break;
      default:
        valid = true;
        break;
    }

    if (!valid) {
      setNotification({ ...notification, visible: true, type: "error", message: errorMessage });
      return;
    }

    setPasswords({
      old: pass.old,
      new: pass.value1
    });
  };

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

  return <>
    <div style={{ margin: "auto", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "15px" }}>
      <Typography
        align="center"
        variant="h4"
      >
        Зміна паролю
      </Typography>
      <FormControl variant="standard" required>
        <InputLabel htmlFor="standard-adornment-password">Поточний пароль</InputLabel>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          onChange={(e) => {
            setPass({
              ...pass,
              old: e.target.value
            });
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((show) => !show)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl variant="standard" required>
        <InputLabel htmlFor="standard-adornment-password">Новий пароль</InputLabel>
        <Input
          type={showNewPassword ? "text" : "password"}
          id="new-password"
          name="new-password"
          error={!pass.valid}
          onChange={handleChangePassword}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowNewPassword((show) => !show)}
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
      <Button
        variant="contained"
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        {!loading && "Змінити пароль"}
        {loading && <CircularProgress />}
      </Button>
    </div>
  </>;
};

export default ChangePasswordForm;


