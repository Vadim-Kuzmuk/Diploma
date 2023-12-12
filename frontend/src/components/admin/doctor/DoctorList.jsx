import React from "react";
import DoctorItem from "./DoctorItem";
import { Grid, Typography } from "@mui/material";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1630px",
  height: "80px"
};

const labelStyle = {
  fontWeight: "bold"
};

const DoctorList = ({
  doctors,
  setEditedData,
  editedData,
  notification,
  setNotification,
  sendPatchRequest,
  sendDeleteRequest,
  disable,
  setDisable
}) => {

  return (
    <>
      <Grid container style={containerStyle} spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" style={labelStyle}>
            ID Працівника
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body1" style={labelStyle}>
            Прізвище
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body1" style={labelStyle}>
            Імʼя
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" style={labelStyle}>
            Телефон
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" style={labelStyle}>
            Email
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography></Typography>
        </Grid>
      </Grid>
      <div className="page-style">
        {doctors && doctors.map((item, key) => (
          <div key={key}>
            <DoctorItem
              doctor={item}
              setEditedData={setEditedData}
              editedData={editedData}
              sendPatchRequest={sendPatchRequest}
              sendDeleteRequest={sendDeleteRequest}
              notification={notification}
              setNotification={setNotification}
              disable={disable}
              setDisable={setDisable}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default DoctorList;