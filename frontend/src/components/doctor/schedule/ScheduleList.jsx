import { Typography } from "@mui/material";
import ScheduleItem from "./ScheduleItem";

const ScheduleList = ({ schedule, setVisitDate }) => {

  return <>
    <Typography
      variant="p"
      sx={{
        color: "#a0a0a0",
        margin: "5px"
      }}
    >
      Doctor schedule:
    </Typography>
    {schedule && schedule.map((times, key) => (
      <ScheduleItem times={times} key={key} setVisitDate = {setVisitDate}/>
    ))
    }
  </>;
};
export default ScheduleList;