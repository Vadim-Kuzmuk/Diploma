import React, { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import ClientVisitDetails from "./ClientVisitDetails";

const CancelVisitForm = ({ visit, setModal, setCancelId }) => {

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
            Скасувати запис
          </Typography>
          <Typography variant="h5" component="div" align="center">
            Ви впевнені, що хочете скасувати запис?
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
                setCancelId(visit.id);
                setModal({
                  visible: false,
                  content: <></>
                });
              }}
              color="error"
            >
              Скасувати запис
            </Button>
            <Button
              fontSize="medium"
              variant="contained"
              onClick={() => {
                setModal({
                  visible: false,
                  content: <></>
                });
              }}
            >
              Повернутися
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </>
    ;
};

export default CancelVisitForm;
