import React from "react";
import RoomItem from "./RoomItem";
import { Grid, Typography } from "@mui/material";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1630px",
  height: "88px"
};

const columnHeaderStyle = {
  fontWeight: "bold"
};

const RoomList = ({
  rooms,
  departments,
  editedData,
  setEditedData,
  sendPatchRequest,
  sendDeleteRequest,
  fetchProducts,
  newRoom,
  notification,
  setNotification,
  disable,
  setDisable
}) => {

  return (
    <>
      <Grid container style={containerStyle} spacing={2}>
        <Grid item xs={2}>
          <Typography variant="body1" style={columnHeaderStyle}>
            ID
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Номер
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Назва
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Відділ
          </Typography>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
      <div className="page-style">
        {rooms && rooms.map((item, key) => (
          <div key={key}>
            <RoomItem
              key={item.id}
              room={item}
              departments={departments}
              newRoom={newRoom}
              fetchProducts={fetchProducts}
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
    </>
  );
};

export default RoomList;
