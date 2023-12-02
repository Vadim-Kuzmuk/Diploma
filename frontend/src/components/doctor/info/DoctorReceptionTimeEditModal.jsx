import {
  Button,
  Card,
  CardContent, Input,
  Modal, Typography
} from "@mui/material";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import uk from "date-fns/locale/uk";

const DoctorInfoEditModal = ({
  start,
  end,
  setStart,
  setEnd,
  appointEditModal,
  setAppointEditModal,
  setEditConfirmed
}) => {

  const [startInputValue, setStartInputValue] = useState(start);
  const [endInputValue, setEndInputValue] = useState(end);

  const confirmEditingButtonClickHandler = (event)=>{
    event.preventDefault();

    setAppointEditModal(false);
    setEditConfirmed(true);


    setStart(startInputValue.getTime() / 1000);
    setEnd(endInputValue.getTime() / 1000);
  }

  const timeChangeHandler = (time) => {
    let date = new Date(time);

    return date.getTime()
  };

  return <>
    <Modal
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "50000"
      }}
      open={appointEditModal}
      onClose={() => {setAppointEditModal(false);}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card
        style={{
          minWidth: "400px",
          padding: "10px"
        }}
      >
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          <Grid container direction="column" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={uk}>
              <Grid item>
                <TimePicker
                  sx={{
                    margin: "5px 0 10px 0",
                    zIndex: "50001"
                  }}
                  label="Час початку робочого дня"
                  onChange={(time) => {setStartInputValue(time);}}
                />
              </Grid>
              <Grid item>
                <TimePicker
                  sx={{
                    margin: "5px 0 10px 0",
                    zIndex: "50001"
                  }}
                  label="Час завершення робочого дня"
                  onChange={(time) => {setEndInputValue(time);}}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item>
              <Button
                onClick = {confirmEditingButtonClickHandler}
                fullWidth
              >
                Підтвердити
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Modal>
  </>;

};

export default DoctorInfoEditModal;