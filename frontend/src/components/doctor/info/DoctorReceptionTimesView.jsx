import { Button, Grid, Input, Typography } from "@mui/material";
import { timestampToDate } from "../../../utils/timestampUtil";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { useEffect, useState } from "react";
import DoctorReceptionTimeEditModal from "./DoctorReceptionTimeEditModal";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import uk from "date-fns/locale/uk";

const DoctorReceptionTimesView = ({
  item,
  setDeleteReceptionTimeId,
  setEditReceptionTimeId,
  editReceptionTimeInfo,
  setAppointEditModal,
  appointEditModal,
  setEditConfirmed,
  setEditStartInfo,
  setEditEndInfo,
  gettingReceptionDay
}) => {

  const [start, setStart] = useState(item.start);
  const [end, setEnd] = useState(item.end);

  const [editing, setEditing] = useState(false);

  const deleteButtonHandler = (event) => {
    event.preventDefault();

    setDeleteReceptionTimeId(item.id);
  };

  const editButtonHandler = (event) => {
    event.preventDefault();

    setEditing(true);
  };

  const doneButtonHandler = (event) => {
    event.preventDefault();

    setEditReceptionTimeId(item.id);

    let startTime = new Date(start<10000000000?start*1000:start);

    startTime = startTime.getHours() * 3600 + startTime.getMinutes() * 60;
    console.log(end);
    let endTime = new Date(end<10000000000?end*1000:end);

    console.log(endTime);

    endTime = endTime.getHours() * 3600 + endTime.getMinutes() * 60;

    setEditStartInfo(gettingReceptionDay + startTime);
    setEditEndInfo(gettingReceptionDay + endTime);

    setEditing(false);
    setEditConfirmed(true);
  };

  return <>
    {!editing ? (
      <Grid container spacing={5}>

        <Grid item>
          <Typography>З </Typography>
        </Grid>

        <Grid item>
          <Typography>
            {timestampToDate(item.start).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Typography>
        </Grid>

        <Grid item>
          <Typography>До </Typography>
        </Grid>

        <Grid item>
          <Typography>
            {timestampToDate(item.end).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Typography>
        </Grid>

        <Grid item>
          <Typography>
            <Button
              onClick={editButtonHandler}
              variant="outlined"
            >
              <EditOutlinedIcon fontSize={"small"} />
            </Button>
            <Button
              onClick={deleteButtonHandler}
              variant="outlined"
            >
              <DeleteOutlineOutlinedIcon fontSize={"small"} />
            </Button>
          </Typography>
        </Grid>

      </Grid>
    ) : (
      <>
        <Grid container spacing={4}>

          <LocalizationProvider dateAdapter={AdapterDateFns} locale={uk}>

            <Grid item>
              <Typography sx={{ width: "fit-content" }}>З</Typography>
              <TimePicker
                defaultValue={timestampToDate(item.start)}
                sx={{
                  margin: "5px 0 10px 0",
                  width: "110px"
                }}
                label="Початок"
                onChange={(time) => {setStart(time.getTime())}}
              />
            </Grid>

            <Grid item>
              <Typography sx={{ width: "fit-content" }}>До</Typography>
              <TimePicker
                defaultValue={timestampToDate(item.end)}
                sx={{
                  margin: "5px 0 10px 0",
                  width: "110px"
                }}
                label="Кінець"
                onChange={(time) => {setEnd(time.getTime())}}
              />
            </Grid>
          </LocalizationProvider>

          <Grid item>
            <Button
              onClick={doneButtonHandler}
              variant="outlined"
              sx={{
                margin: "35px 0 0 0"
              }}
            >

              <DoneOutlinedIcon fontSize={"small"} />

            </Button>
          </Grid>

          <Grid item>
            <Button
              onClick={deleteButtonHandler}
              variant="outlined"
              sx={{
                margin: "35px 0 0 0"
              }}
            >

              <DeleteOutlineOutlinedIcon fontSize={"small"}/>

            </Button>
          </Grid>
        </Grid>
      </>
    )}
  </>;
};

export default DoctorReceptionTimesView;