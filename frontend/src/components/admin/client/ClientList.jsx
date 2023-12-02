import React from "react";
import ClientItem from "./ClientItem";
import { Grid, Typography } from "@mui/material";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  width: "1630px",
  height: "80px"
};

const columnHeaderStyle = {
  fontWeight: "bold"
};

const ClientList = ({
  clients
}) => {

  return (
    <>
      <Grid container style={containerStyle} spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" style={columnHeaderStyle}>
            ID
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Фамілія
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Ім'я
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Телефон
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Email
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Стать
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Дата народження
          </Typography>
        </Grid>
      </Grid>
      <Grid container style={containerStyle} spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Адрес проживання
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Адрес реєстрації
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Паспорт
          </Typography>
        </Grid>
        <Grid item xs={5}>
        </Grid>
      </Grid>
      <div className="page-style">
        {clients && clients.map((item, key) => (
          <div key={key}>
            <ClientItem
              key={item.id}
              client={item}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ClientList;
