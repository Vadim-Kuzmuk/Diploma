import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import PlannedVisitsContainer from "../visits/PlannedVisitsContainer";
import FinishedVisitsContainer from "../visits/FinishedVisitsContainer";
import DoctorInfoContainer from "../info/DoctorInfoContainer";
import { Helmet } from "react-helmet-async";
import Notification from "../../elements/notification/Notification";

const DoctorCabinetContainer = ()=>{

  const [currentPage, setCurrentPage] = useState("info");
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  return <>
    <Helmet>
      <title>
        Кабінет лікаря
      </title>
    </Helmet>
    {notification.visible &&
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
    }
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "16px"
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Button
                variant={currentPage === "info" ? "contained" : "outlined"}
                onClick={() => changePage("info")}
                fullWidth
              >
                Звітність
              </Button>
            </Grid>
          </Grid>
        </div>

        <div style={{ padding: "16px" }}>
          {currentPage === "info" && <DoctorInfoContainer setNotification={setNotification} />}
        </div>
      </div>
    </div>
  </>

}
export default DoctorCabinetContainer;