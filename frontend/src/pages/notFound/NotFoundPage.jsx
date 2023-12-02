import { Helmet } from "react-helmet-async";
import React from "react";
import { Alert, AlertTitle } from "@mui/material";

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>
          Сторінку не знайдено
        </title>
      </Helmet>
      <Alert severity="error">
        <AlertTitle>Сторінку не знайдено!</AlertTitle>
      </Alert>
    </>
  );
};

export default NotFoundPage;