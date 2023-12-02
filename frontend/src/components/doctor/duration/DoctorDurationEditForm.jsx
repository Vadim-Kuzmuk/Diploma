import { Button, Input, Typography } from "@mui/material";
import React, { useState } from "react";

const DoctorDurationEditForm  = ({ doctorDuration, setDoctorDuration })=>{

  const [durationFieldValue, setDurationFieldValue] = useState(doctorDuration);

  const durationUpdateButtonClickHandler = (event)=>{
    event.preventDefault();

    setDoctorDuration({duration: parseInt(durationFieldValue)});
  }
  console.log(durationFieldValue);
  return <>
    <Typography>Тривалість прийому: </Typography>
    <Input
      type="number"
      defaultValue={durationFieldValue}
      onChange={(e) => {
        if (e.target.value <= 0) {
          e.target.value = 0;
        }else{
          setDurationFieldValue(e.target.value)
        }
      }}
      variant="outlined"
      fullWidth
      margin="normal"
    />
    <Button
      variant="contained"
      color="primary"
      onClick={durationUpdateButtonClickHandler}
    >
      Оновити тривалість прийому
    </Button>
  </>
}
export default DoctorDurationEditForm;