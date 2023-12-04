import { Button, Divider, Grid, Input, Typography } from "@mui/material";
import React, { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { timestampToDate } from "../../../utils/timestampUtil";

const DoctorPersonalInfo = ({
  doctor
}) => {

  return <div
    style={{
      height: "100%",
      minWidth: "350px",
      maxWidth: "500px",
      display: doctor ? "flex" : "none",
      flexDirection: "column",
      padding: "10px 15px",
      boxSizing: "border-box",
      overflowY: "auto",
      position: "relative",
      boxShadow: "-5px 0px 10px 0px rgba(0,0,0,0.25)"
    }}
  >
    {doctor && <>
      <Typography variant="h4" sx={{ margin: "5px 0 0 0" }}>
        {doctor.firstName} {doctor.lastName}
      </Typography>
      <Typography variant="h5" sx={{ margin: "5px 0 0 0" }}>
        {doctor.doctorInfo.speciality.title}
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Email:</b> {doctor.email}
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Телефон:</b> {doctor.phone}
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Дата народження:</b> {timestampToDate(doctor.birthday).toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })}
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Стать:</b> {doctor.sex === "m" ? "чоловік" : "жінка"}
      </Typography>
    </>}
  </div>;
};

export default DoctorPersonalInfo;