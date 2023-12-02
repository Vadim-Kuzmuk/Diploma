import React from "react";
import PriceItem from "./PriceItem";
import { Grid, Typography } from "@mui/material";

const containerStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "8px"
};

const columnHeaderStyle = {
  fontWeight: "bold",
};

const PriceList = ({ prices, fetchProducts }) => {
  return (
    <>
      <Grid container style={containerStyle} spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Ціна консультації
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" style={columnHeaderStyle}>
            Ціна візиту
          </Typography>
        </Grid>
      </Grid>
      <div className="page-style">
        {prices && (
          <PriceItem price={prices} fetchProducts={fetchProducts} />
        )}
      </div>
    </>
  );
};

export default PriceList;
