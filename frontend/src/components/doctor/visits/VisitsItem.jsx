import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import React from "react";
import { timestampToDate } from "../../../utils/timestampUtil";

const VisitsItem = ({ visit, key }) => {

  const clientBirthday = timestampToDate(visit.birthday);

  const visitDate = timestampToDate(visit.date);

  return <>
    <Card
      key={key}
      sx={{
        minWidth: 500,
        maxWidth: 700,
        transition: "150ms ease-in-out",
        margin: "10px",
        ":hover": {
          transform: "scale(1.02)"
        }
      }}
      style={{
        cursor: "pointer",
        boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.25)"
      }}
    >
      <CardActionArea
      >
        <CardContent
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography variant="h5" component="div">
              {visit.firstName} {visit.lastName}
            </Typography>
            <Typography variant="p" style={{ color: "#b0b0b0" }}>
              Номер телефону: {visit.phone}
            </Typography>
            <Typography variant="p" style={{ color: "#b0b0b0" }}>
              Дата народження: {clientBirthday.getDate() > 10
              ? clientBirthday.getDate() :
              "0" + clientBirthday.getDate().toString()}.{clientBirthday.getMonth()+1 > 10
              ? clientBirthday.getMonth()+1 :
              "0" + (clientBirthday.getMonth()+1).toString()}.{clientBirthday.getFullYear()}
            </Typography>
            <Typography variant="p" style={{ color: "#b0b0b0" }}>
              Стать: {visit.sex === "m" ? "чоловік" : visit.sex === "f" ? "жінка" : "non-binary"}
            </Typography>
            <div
              style={{
                marginTop: "10px"
              }}
            >
              <Typography variant="h5" component="div">
                {visit.price} грн.
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "70px"
            }}
          >
            <Typography variant="h6" component="div">
              Час прийому: {visitDate.getHours() >= 10
              ? visitDate.getHours() :
              "0" + visitDate.getHours().toString()}:{visitDate.getMinutes() >= 10
              ? visitDate.getMinutes() :
              "0" + visitDate.getMinutes().toString()}
            </Typography>
            <Typography variant="h6" component="div">
              Дата прийому: {visitDate.getDate() >= 10
              ? visitDate.getDate() :
              "0" + visitDate.getDate().toString()}.{visitDate.getMonth()+1 >= 10
              ? visitDate.getMonth()+1 :
              "0" + (visitDate.getMonth()+1).toString()}.{visitDate.getFullYear()}
            </Typography>

          </div>
          <Card
            key={key}
            sx={{
              width: "100px",
              height: "100px",
              transition: "150ms ease-in-out"
            }}
            style={{
              boxShadow: "unset",
              borderRadius: "5px",
              backgroundColor: "#eeeeee"
            }}
          >
            <CardContent
              style={{
                padding: "10px",
                color: "#909090",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography variant="h4">
                {visit.number}
              </Typography>
              <Typography variant="h6">
                Кабінет
              </Typography>
            </CardContent>
          </Card>
        </CardContent>
      </CardActionArea>
    </Card>
  </>;
};

export default VisitsItem;