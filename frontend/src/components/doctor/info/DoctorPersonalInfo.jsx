import { Button, Divider, Grid, Input, Typography } from "@mui/material";
import React, { useState } from "react";
import { dateToTimestamp, timestampToDate } from "../../../utils/timestampUtil";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import uk from "date-fns/locale/uk";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoctorReceptionTimesView from "./DoctorReceptionTimesView";
import DoctorInfoEditModal from "./DoctorInfoEditModal";

const DoctorPersonalInfo = ({
  doctor,
  setGettingReceptionDay,
  gettingReceptionDay,
  gettingReceptionTimes,
  days,
  setDeleteReceptionTimeId,
  setEditReceptionTimeId,
  appointModalOpen,
  setAppointModalOpen,
  setNotification,
  setEditConfirmed,
  editReceptionTimeInfo,
  setEditEndInfo,
  setEditStartInfo
}) => {

  const [appointEditModal, setAppointEditModal] = useState();

  const isDisabledDate = (date) => {
    const result = !days || !days?.includes(dateToTimestamp(date.setHours(0, 0, 0, 0)));
    return result;
  };

  const editButtonClickHandler = (event) => {
    event.preventDefault();

    setAppointModalOpen(true);
  };

  return <div
    style={{
      height: "100%",
      minWidth: "350px",
      maxWidth: "500px",
      display: doctor ? "flex" : "none",
      flexDirection: "column",
      padding: "10px 15px",
      boxSizing: "border-box",
      overflowY: "auto",
      position: "relative",
      boxShadow: "-5px 0px 10px 0px rgba(0,0,0,0.25)"
    }}
  >
    {doctor && <>
      <Typography
        variant="h4"
        sx={{
          margin: "5px 0 0 0"
        }}
      >
        {doctor.firstName} {doctor.lastName}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          margin: "5px 0 0 0"
        }}
      >
        {doctor.doctorInfo.speciality.title}
      </Typography>
      <Divider />
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Email:</b> {doctor.email}
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Телефон:</b> {doctor.phone}
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Дата народження:</b> {timestampToDate(doctor.birthday).toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })}
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Стать:</b> {doctor.sex === "m" ? "чоловік" : "жінка"}
      </Typography>

      <Divider />

      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Кабінет:</b> {doctor.doctorInfo.room.number}
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Ціна за годину прийому:</b> {doctor.doctorInfo.visitPrice} грн.
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Ціна за годину консультації:</b> {doctor.doctorInfo.consultationPrice} грн.
      </Typography>
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        <b>Тривалість прийому:</b> {doctor.doctorInfo.duration} хв.
      </Typography>

      <Button onClick={editButtonClickHandler} variant="outlined">
        <EditOutlinedIcon />
      </Button>

      <Divider />
      <Typography variant="p" sx={{ margin: "5px 0" }}>
        Графіки роботи:
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={uk}>
        <DatePicker
          sx={{
            margin: "5px 0 10px 0"
          }}
          disablePast
          label="Оберіть день"
          minDate="-2208988800"
          onChange={(date) => {setGettingReceptionDay(dateToTimestamp(date));}}
          shouldDisableDate={isDisabledDate}
        />
      </LocalizationProvider>
      {gettingReceptionTimes && <>
        {gettingReceptionTimes.map((item, key) => {
          return <> <DoctorReceptionTimesView
            item={item}
            editReceptionTimeInfo = {editReceptionTimeInfo}
            setDeleteReceptionTimeId={setDeleteReceptionTimeId}
            setEditReceptionTimeId={setEditReceptionTimeId}
            setAppointEditModal = {setAppointEditModal}
            appointEditModal = {appointEditModal}
            setEditConfirmed = {setEditConfirmed}
            setEditStartInfo={setEditStartInfo}
            setEditEndInfo={setEditEndInfo}
            gettingReceptionDay = {gettingReceptionDay}
          />
            <Divider
              sx={{
                marginTop: "10px",
                marginBottom: "10px"
              }}
            />
          </>;
        })}</>}

    </>}
    <DoctorInfoEditModal
      appointModalOpen={appointModalOpen}
      setAppointModalOpen={setAppointModalOpen}
      visitPrice={doctor && doctor.doctorInfo.visitPrice}
      consultationPrice={doctor && doctor.doctorInfo.consultationPrice}
      duration={doctor && doctor.doctorInfo.duration}
      setNotification={setNotification}
    />
  </div>;
};

export default DoctorPersonalInfo;