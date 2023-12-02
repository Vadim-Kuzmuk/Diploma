import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Card, CardActions,
  CardContent,
  CircularProgress, Divider, FormControl, FormControlLabel, FormLabel,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal, Radio, RadioGroup,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { dateToTimestamp, timestampToDate } from "../../utils/timestampUtil";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import uk from "date-fns/locale/uk";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { appoint } from "../../rbac-consts";
import { NavLink } from "react-router-dom";
import { AccountBoxOutlined, LogoutOutlined } from "@mui/icons-material";
import eventBus from "../../utils/eventBus";
import Can from "../elements/can/Can";
import { AppContext } from "../../App";

const AppointForm = ({
  doctor,
  schedule,
  days,
  day,
  setDay,
  setVisitInfo,
  visitLoading,
  appointModalOpen,
  setAppointModalOpen
}) => {
  const [info, setInfo] = useState(null);
  const { user } = useContext(AppContext);

  const visitDateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  };

  const isDisabledDate = (date) => {
    const result = !days || !days?.includes(dateToTimestamp(date.setHours(0, 0, 0, 0)));
    return result;
  };

  useEffect(() => {
    setDay(null);
    setInfo({
      doctor: doctor?.user.id,
      date: null,
      room: doctor?.formats.online && doctor?.consultationPrice ? null : doctor?.room.id
    });
  }, [doctor]);

  return <>
    <div
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
          {doctor.user.firstName} {doctor.user.lastName}
        </Typography>
        <Typography variant="p" style={{ color: "#b0b0b0", margin: "0 0 5px 0" }}>
          {doctor.formats.offline && "Прийоми"} {doctor.formats.offline && doctor.formats.online && "/"} {doctor.formats.online && "Консультації"}
        </Typography>

        <Typography variant="p" sx={{ margin: "5px 0" }}>
          <b>Телефон:</b> {doctor.user.phone}
        </Typography>
        <Typography variant="p" sx={{ margin: "5px 0" }}>
          <b>Кабінет:</b> {doctor.room.number} ({doctor.room.name})
        </Typography>
        {doctor.formats.online && doctor.consultationPrice && <Typography variant="p" sx={{ margin: "5px 0" }}>
          <b>Ціна за консультацію:</b> {Math.round(doctor.consultationPrice / (60 / doctor.duration) * 100) / 100} грн
        </Typography>}
        {doctor.formats.offline && doctor.visitPrice && <Typography variant="p" sx={{ margin: "5px 0" }}>
          <b>Ціна за прийом:</b> {Math.round(doctor.visitPrice / (60 / doctor.duration) * 100) / 100} грн
        </Typography>}

        <Divider sx={{ margin: "10px 0" }} />
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={uk}>
          <DatePicker
            sx={{
              margin: "5px 0 10px 0"
            }}
            disablePast
            label="Оберіть день"
            minDate="-2208988800"
            shouldDisableDate={isDisabledDate}
            value={day ? timestampToDate(day) : null}
            onChange={(date) => {setDay(dateToTimestamp(date));}}
          />
        </LocalizationProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >
          {schedule && schedule.map((visit, key) => {
              const visitDate = timestampToDate(visit);
              return <Button
                key={key}
                variant="contained"
                onClick={() => {
                  setInfo({ ...info, date: visit });
                  setAppointModalOpen(true);
                }}
                style={{
                  width: "50px"
                }}
              >
                {visitDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Button>;
            }
          )}
        </div>
        <Modal
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "50000"
          }}
          open={appointModalOpen}
          onClose={() => {setAppointModalOpen(false);}}
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
              <Typography
                align="center"
                variant="h4"
              >
                Запис до лікаря
              </Typography>
              <Typography
                variant="p"
              >
                <b>Дата і
                   час:</b> {info?.date && Intl.DateTimeFormat(["uk-UA"], visitDateFormatOptions).format(timestampToDate(info?.date))}
              </Typography>
              <Typography
                variant="p"
              >
                <b>Тривалість:</b> {doctor.duration} хвилин
              </Typography>
              <Typography
                variant="p"
              >
                <b>Лікар:</b> {doctor.user.firstName} {doctor.user.lastName}
              </Typography>
              <Typography
                variant="p"
              >
                <b>Кабінет:</b> {doctor.room.number} ({doctor.room.name})
              </Typography>
              <Typography
                variant="p"
              >
                <b>Відділ:</b> {doctor.speciality.department.title}
              </Typography>
              <FormControl variant="standard" required>
                <FormLabel>Формат</FormLabel>
                <RadioGroup
                  column
                  name="visitFormat"
                  id="visitFormat"
                  defaultValue={doctor.formats.online && doctor.consultationPrice !== undefined ? "online" : "offline"}
                  onChange={(e) => {
                    const room = e.target.value === "offline" ? doctor.room.id : null;
                    setInfo({ ...info, room: room });
                  }}
                >
                  <FormControlLabel
                    disabled={!doctor.formats.online || doctor.consultationPrice === undefined || visitLoading}
                    value="online"
                    control={<Radio />}
                    label={`Консультація (онлайн) - ${
                      doctor.consultationPrice !== undefined ?
                        Math.round(doctor.consultationPrice / (60 / doctor.duration) * 100) / 100 :
                        "--"
                    } грн`}
                  />
                  <FormControlLabel
                    disabled={!doctor.formats.offline || doctor.visitPrice === undefined || visitLoading}
                    value="offline"
                    control={<Radio />}
                    label={`Прийом (оффлайн) - ${
                      doctor.visitPrice !== undefined ?
                        Math.round(doctor.visitPrice / (60 / doctor.duration) * 100) / 100 :
                        "--"
                    } грн`}
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
            <CardActions>
              <Can
                role={user?.roles}
                perform={appoint.CLIENT}
                yes={() =>
                  <>
                    {visitLoading && <CircularProgress style={{ margin: "5px auto 0 auto" }} />}
                    {!visitLoading && <Button
                      style={{
                        margin: "5px auto 0 auto"
                      }}
                      variant="contained"
                      onClick={() => {setVisitInfo(info);}}
                    >
                      Записатися
                    </Button>
                    }
                  </>
                }
                no={() => <Alert severity="error">
                  <AlertTitle>Запис доступний лише з акаунту користувача!</AlertTitle>
                </Alert>}
              />
            </CardActions>
          </Card>
        </Modal>
      </>
      }
    </div>
  </>;
};

export default AppointForm;


