import { Button } from "@mui/material";

const ScheduleButton = ({ visitTime, key, value, setVisitDate }) => {

  const handleScheduleButtonClick = (event)=>{
    event.preventDefault();

    setVisitDate(value.toString());
  }

  return (
    <Button
      key={key}
      variant="contained"
      type="submit"
      onClick = {handleScheduleButtonClick}
    >
      {visitTime}
    </Button>);
};

export default ScheduleButton;