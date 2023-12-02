import React from "react";
import { Grid, Typography } from "@mui/material";

const containerStyle = {
  alignItems: "center",
  justifyContent: "left",
  padding: "8px"
};

const PriceItem = ({ price }) => {
  const { consultationPrice, visitPrice, operationPrice } = price;

  return (
    <Grid container style={containerStyle} spacing={2}>
      <Grid item xs={3}>
        <Typography variant="body1">{consultationPrice}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body1">{visitPrice}</Typography>
      </Grid>
    </Grid>
  );
};

export default PriceItem;
