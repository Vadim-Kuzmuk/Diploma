import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import uk from "date-fns/locale/uk";
import { dateToTimestamp, timestampToDate } from "../../../utils/timestampUtil";
import React from "react";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

const DoctorReceptionTimeForm = ({
  receptionDay,
  receptionStartTime,
  receptionEndTime,
  confirmedReceptionStartDateTime,
  confirmedReceptionEndDateTime,
  setReceptionDay,
  setReceptionStartTime,
  setReceptionEndTime,
  setConfirmedReceptionStartDateTime,
  setConfirmedReceptionEndDateTime,
  setNotification
}) => {

  const timeChangeHandler = (time) => {
    let date = new Date(time);

    let hours = date.getHours() * 3600;
    let minutes = date.getMinutes() * 60;

    return hours + minutes;
  };

  const confirmReceptionTimeHandler = (event) =>{
    event.preventDefault();

    if(!(receptionDay && receptionStartTime && receptionEndTime)){
      setNotification("Заповніть всі поля для вводу часу прийому")

      return;
    }

    setConfirmedReceptionStartDateTime(receptionDay + receptionStartTime);
    setConfirmedReceptionEndDateTime(receptionDay + receptionEndTime);
  }

  return <>
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant={"h6"}>
          Додати новий розклад прийомів:
        </Typography>
      </Grid>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={uk}>
        <Grid item>
          <DatePicker
            sx={{
              margin: "5px 0 10px 0"
            }}
            disablePast
            label="Оберіть день"
            minDate="-2208988800"
            onChange={(date) => {setReceptionDay(dateToTimestamp(date));}}
          />
        </Grid>
        <Grid item>
          <TimePicker
            sx={{
              margin: "5px 0 10px 0"
            }}
            label="Час початку робочого дня"
            disabled = {!receptionDay}
            onChange={(time) => {setReceptionStartTime(timeChangeHandler(time));}}
          />
        </Grid>
        <Grid item>
          <TimePicker
            sx={{
              margin: "5px 0 10px 0"
            }}
            label="Час завершення робочого дня"
            disabled = {!(receptionDay && receptionStartTime)}
            onChange={(time) => {setReceptionEndTime(timeChangeHandler(time));}}
          />
        </Grid>
      </LocalizationProvider>
      <Grid item>
        <Button
          onClick = {confirmReceptionTimeHandler}
          fullWidth
          disabled = {!(receptionDay && receptionStartTime && receptionEndTime)}
        >
          Підтвердити
        </Button>
      </Grid>
    </Grid>

  </>;
};

export default DoctorReceptionTimeForm;