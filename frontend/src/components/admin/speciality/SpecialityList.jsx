import React from "react";
import SpecialityItem from "./SpecialityItem";
import { Grid, Typography } from "@mui/material";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1500px",
  height: "88px"
};

const labelStyle = {
  fontWeight: "bold"
};

const SpecialityList = ({
  specialities,
  departments,
  editedData,
  setEditedData,
  sendPatchRequest,
  sendDeleteRequest,
  notification,
  setNotification,
  disable,
  setDisable
}) => {

  return <>
    <Grid container style={containerStyle} spacing={2}>
      <Grid item xs={3}>
        <Typography variant="body1" style={labelStyle}>
          ID
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1" style={labelStyle}>
          Назва
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body1" style={labelStyle}>
          Відділ
        </Typography>
      </Grid>
      <Grid item xs={3}>
      </Grid>
    </Grid>
    <div className="page-style">
      {specialities && specialities.map((item, key) => (
        <div key={key}>
          <SpecialityItem
            speciality={item}
            departments={departments}
            sendPatchRequest={sendPatchRequest}
            sendDeleteRequest={sendDeleteRequest}
            editedData={editedData}
            setEditedData={setEditedData}
            notification={notification}
            setNotification={setNotification}
            disable={disable}
            setDisable={setDisable}
          />
        </div>
      ))}
    </div>
  </>;
};

export default SpecialityList;