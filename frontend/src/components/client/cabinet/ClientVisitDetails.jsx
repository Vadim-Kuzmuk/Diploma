import React, { useState } from "react";
import { Button, Card, CardActionArea, CardContent, Link, Typography } from "@mui/material";
import { dateToTimestamp, timestampToDate } from "../../../utils/timestampUtil";
import PayVisitForm from "./PayVisitForm";
import CancelVisitForm from "./CancelVisitForm";

const ClientVisitDetails = ({ visit, setModal, setPayId, setCancelId }) => {
  const visitDateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  };

  const isPaid = !visit.roomNumber && dateToTimestamp(new Date()) <= parseInt(visit.date) + visit.duration * 60 && visit.isPaid;
  const isNotPaid = !visit.roomNumber && dateToTimestamp(new Date()) <= parseInt(visit.date) + visit.duration * 60 && !visit.isPaid;

  return <>
    <Card>
      <CardContent
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "30px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px"
          }}
        >
          <Typography
            align="center"
            variant="h4"
            style={{ marginBottom: "20px" }}
          >
            Інформація про візит
          </Typography>
          <Typography variant="h6" component="div">
            <b>Лікар: </b>{visit.doctorFirstName} {visit.doctorLastName} - <span style={{ color: "text.disabled" }}>{visit.specialityTitle}</span>
          </Typography>
          <div style={{ display: "flex", gap: "5px" }}>
            <Typography
              variant="h6"
            >
              <b>Дата і
                 час: </b>{Intl.DateTimeFormat(["uk-UA"], visitDateFormatOptions).format(timestampToDate(visit.date))}
              <> (Тривалість {visit.duration} хв)</>
            </Typography>
            {dateToTimestamp(new Date()) > visit.date && !visit.conclusion &&
              <Typography variant="h6" sx={{ color: "error.main" }}>Пропущено</Typography>
            }
          </div>
          {visit.roomNumber &&
            <Typography variant="h6" component="div">
              <b>Кабінет</b> {visit.roomNumber} {visit.roomName && ` (${visit.roomName})`}
            </Typography>
          }
          {isPaid &&
            <Typography variant="h6" component="div">
              <b>Посилання: </b><Link href={"https://" + visit.link} target="_blank" rel="noopener noreferrer">{visit.link}</Link>
            </Typography>
          }
          {isNotPaid && <>
            <Typography variant="h6" component="div" sx={{ color: "error.main" }}>
              Посилання стане доступним після оплати
            </Typography>
          </>}
          <Typography variant="h6" component="div">
            <b>Вартість: {Math.round(visit.price / (60 / visit.duration) * 100) / 100} грн</b>
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {isNotPaid && <>
              <Button
                style={{ width: "max-content" }}
                variant="contained"
                onClick={() => {
                  setModal({
                    visible: true,
                    content: <PayVisitForm visit={visit} setModal={setModal} setPayId={setPayId} />
                  });
                }}
              >
                Оплатити консультацію
              </Button>
            </>}
            {dateToTimestamp(new Date()) <= parseInt(visit.date) + visit.duration * 60 && <Button
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setModal({
                  visible: true,
                  content: <CancelVisitForm visit={visit} setModal={setModal} setCancelId={setCancelId} />
                });
              }}
            >
              Скасувати
            </Button>}
          </div>
          {visit.conclusion && <>
            <Typography variant="h6" component="div" style={{ marginTop: "15px" }}>
              <b>Вердикт лікаря:</b> {visit.conclusion}
            </Typography>
          </>}
        </div>
      </CardContent>
    </Card>
  </>
    ;
};

export default ClientVisitDetails;
