import React from "react";
import {
  ButtonBase,
  Card, CardActionArea,
  CardContent,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";

const DoctorList = ({ department, doctors, setDoctor, speciality, loading }) => {
  return <>
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "10px 15px",
        boxSizing: "border-box",
        overflowY: "auto",
        position: "relative"
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#a0a0a0",
          margin: "5px"
        }}
      >
        {department && (department.title + " / ")} {speciality && speciality.title || "Оберіть спеціальність"}
      </Typography>
      {loading &&
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CircularProgress />
        </div>
      }
      {(!doctors || doctors.filter((doctor) =>
          ((doctor.formats.online && doctor.consultationPrice) || (doctor.formats.offline && doctor.visitPrice)) && doctor.duration
        ).length === 0) && !loading && speciality &&
        <Typography
          variant="p"
          sx={{
            color: "#a0a0a0",
            margin: "5px"
          }}
        >
          Лікарі відсутні
        </Typography>
      }
      {speciality && doctors && !loading && doctors.filter((doctor) =>
        ((doctor.formats.online && doctor.consultationPrice !== null) || (doctor.formats.offline && doctor.visitPrice !== null)) && doctor.duration
      ).map((doctor, key) =>
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
            onClick={() => {setDoctor(doctor);}}
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
                  {doctor.user.firstName} {doctor.user.lastName}
                </Typography>
                <Typography variant="p" style={{ color: "#b0b0b0" }}>
                  {doctor.formats.offline && doctor.visitPrice && "Прийоми"}
                  {doctor.formats.offline && doctor.visitPrice && doctor.formats.online && doctor.consultationPrice && "/"}
                  {doctor.formats.online && doctor.consultationPrice && "Консультації"}
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
                    {doctor.room.number}
                  </Typography>
                  <Typography variant="h6">
                    Кабінет
                  </Typography>
                </CardContent>
              </Card>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </div>
  </>;
};

export default DoctorList;


