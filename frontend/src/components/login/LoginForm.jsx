import React from "react";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const LoginForm = ({ setAuthData, loading }) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    setAuthData({
      username: event.target.username.value,
      password: event.target.password.value
    });
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <Typography
        align="center"
        variant="h4"
      >
        Вхід
      </Typography>
      <TextField
        variant="standard"
        id="username"
        type="email"
        label="E-mail"
        name="username"
        required
      />
      <FormControl variant="standard" required>
        <InputLabel htmlFor="standard-adornment-password">Пароль</InputLabel>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
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
      </FormControl>
      <Button
        variant="contained"
        type="submit"
        disabled={loading}
      >
        Увійти
      </Button>
      <Typography
        align="center"
        variant="p"
        sx={{color: '#a0a0a0'}}
      >
        або
      </Typography>
      <Button
        variant="text"
        type="submit"
        to="/register"
        component={NavLink}
        disabled={loading}
      >
        Зареєструватися
      </Button>
    </form>
  );
};

export default LoginForm;