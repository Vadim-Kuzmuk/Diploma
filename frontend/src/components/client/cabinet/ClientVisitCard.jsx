import React, { useState } from "react";
import { Button, Card, CardActionArea, CardContent, Link, Typography } from "@mui/material";
import { dateToTimestamp, timestampToDate } from "../../../utils/timestampUtil";
import ClientVisitDetails from "./ClientVisitDetails";
import CancelVisitForm from "./CancelVisitForm";

const ClientVisitCard = ({ visit, key, setModal, setPayId, setCancelId }) => {
  const [showConclusion, setShowConclusion] = useState(false);

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
    <Card
      key={key}
      sx={{
        minWidth: 700,
        transition: "150ms ease-in-out",
        margin: "10px",
        ":hover": {
          transform: "scale(1.01)"
        }
      }}
    >
      <CardActionArea
        onClick={() => {
          setModal({
            visible: true,
            content:
              <ClientVisitDetails visit={visit} setModal={setModal} setPayId={setPayId} setCancelId={setCancelId} />
          });
        }}
      >
        <CardContent
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            boxSizing: "border-box",
            padding: "15px"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <Typography
                variant="h6"
              >
                <b>{Intl.DateTimeFormat(["uk-UA"], visitDateFormatOptions).format(timestampToDate(visit.date))}</b>
                <> (Тривалість {visit.duration} хв)</>
              </Typography>
              {dateToTimestamp(new Date()) > visit.date && !visit.conclusion &&
                <Typography variant="h6" sx={{ color: "error.main" }}>Пропущено</Typography>
              }
            </div>
            <Typography variant="h4" component="div">
              {visit.doctorFirstName} {visit.doctorLastName}
            </Typography>
            <Typography variant="h6" component="div">
              {visit.specialityTitle}
            </Typography>
            {visit.roomNumber &&
              <Typography variant="h6" component="div">
                Кабінет {visit.roomNumber} {visit.roomName && ` (${visit.roomName})`}
              </Typography>
            }
            {isPaid &&
              <Typography variant="h6" component="div">
                <b>Посилання: </b><Link href={"https://" + visit.link} target="_blank" rel="noopener noreferrer">{visit.link}</Link>
              </Typography>}
            {isNotPaid &&
              <Typography variant="h6" component="div" sx={{ color: "error.main" }}>
                Посилання стане доступним після оплати
              </Typography>
            }
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" component="div">
                <b>Вартість: {Math.round(visit.price / (60 / visit.duration) * 100) / 100} грн</b>
              </Typography>
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
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  </>
    ;
};

export default ClientVisitCard;
