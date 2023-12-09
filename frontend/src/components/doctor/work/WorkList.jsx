import React from "react";
import WorkItem from "./WorkItem";
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

const WorkList = ({
  works,
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
      <Grid item xs={1}>
        <Typography variant="body1" style={labelStyle}>
          Години роботи
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body1" style={labelStyle}>
          Секунди
        </Typography>
      </Grid>
      <Grid item xs={5}>
      </Grid>
    </Grid>
    <div className="page-style">
      {works && works.map((item, key) => (
        <div key={key}>
          <WorkItem
            work={item}
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

export default WorkList;