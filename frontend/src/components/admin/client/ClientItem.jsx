import React from "react";
import { Grid, Typography } from "@mui/material";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1630px",
  height: "160px",
  backgroundColor: "#e3e3e3",
  borderRadius: "10px",
  marginBottom: "30px"
};

const ClientItem = ({
  client
}) => {

  return (
    <Grid container style={containerStyle} spacing={2}>
      <Grid item xs={3}>
        <Typography>{client.user.id}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{client.user.lastName}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{client.user.firstName}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography>{client.user.phone}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography>{client.user.email}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{client.user.sex}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography>
          {client.user.birthday ? new Date(client.user.birthday * 1000).toLocaleDateString() : ''}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography>{JSON.stringify(client.user.address)}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography>{JSON.stringify(client.user.registration)}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{client.user.passport}</Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography />
      </Grid>
    </Grid>
  );
};

export default ClientItem;
