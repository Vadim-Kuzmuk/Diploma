import React, { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import ClientVisitDetails from "./ClientVisitDetails";

const PayVisitForm = ({ visit, setModal, setPayId }) => {

  return <>
    <Card>
      <CardContent
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          boxSizing: "border-box",
          padding: "40px 60px"
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          <Typography
            align="center"
            variant="h4"
            style={{ marginBottom: "20px" }}
          >
            Оплатити візит
          </Typography>
          <Typography variant="h5" component="div" align="center">
            <b>Сума: </b>{Math.round(visit.price / (60 / visit.duration) * 100) / 100} грн
          </Typography>
          <div
            style={{
              margin: "auto",
              display: "flex",
              flexDirection: "row",
              gap: "5px"
            }}
          >
            <Button
              fontSize="medium"
              variant="contained"
              onClick={() => {
                setPayId(visit.id);
                setModal({
                  visible: true,
                  content: <ClientVisitDetails visit={visit} setModal={setModal} setPayId={setPayId} />
                });
              }}
              color="success"
            >
              Оплатити
            </Button>
            <Button
              fontSize="medium"
              variant="contained"
              onClick={() => {
                setModal({
                  visible: true,
                  content: <ClientVisitDetails visit={visit} setModal={setModal} setPayId={setPayId} />
                });
              }}
              color="error"
            >
              Скасувати
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </>
    ;
};

export default PayVisitForm;
