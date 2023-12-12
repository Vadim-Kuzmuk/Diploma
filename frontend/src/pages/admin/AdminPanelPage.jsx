import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DoctorContainer from "../../components/admin/doctor/DoctorContainer";
import DoctorInfoContainer from "../../components/doctor/info/DoctorInfoContainer";
import Visualization1 from "../../components/admin/visualization/Visualization1";
import Visualization2 from "../../components/admin/visualization/Visualization2";
import Visualization3 from "../../components/admin/visualization/Visualization3";
import Visualization4 from "../../components/admin/visualization/Visualization4";
import Visualization5 from "../../components/admin/visualization/Visualization5";
import Visualization6 from "../../components/admin/visualization/Visualization6";

const AdminPanelPage = () => {
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || "department"
  );

  const changePage = (newPage) => {
    setCurrentPage(newPage);
    localStorage.setItem("currentPage", newPage);
  };

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "16px",
            width: "150px"
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Button
                variant={currentPage === "doctor" ? "contained" : "outlined"}
                onClick={() => changePage("doctor")}
                fullWidth
              >
                Працівники
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "info" ? "contained" : "outlined"}
                onClick={() => changePage("info")}
                fullWidth
              >
                Звітність
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "visualization2" ? "contained" : "outlined"}
                onClick={() => changePage("visualization2")}
                fullWidth
              >
                Відпрацьвано годин
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "visualization3" ? "contained" : "outlined"}
                onClick={() => changePage("visualization3")}
                fullWidth
              >
                Створено секунд
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "visualization1" ? "contained" : "outlined"}
                onClick={() => changePage("visualization1")}
                fullWidth
              >
                Порівняння
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "visualization4" ? "contained" : "outlined"}
                onClick={() => changePage("visualization4")}
                fullWidth
              >
                Ефективність
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "visualization5" ? "contained" : "outlined"}
                onClick={() => changePage("visualization5")}
                fullWidth
              >
                Проекти
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "visualization6" ? "contained" : "outlined"}
                onClick={() => changePage("visualization6")}
                fullWidth
              >
                Прогнозування
              </Button>
            </Grid>
          </Grid>
        </div>

        <div style={{ padding: "16px" }}>
          {currentPage === "doctor" && <DoctorContainer />}
          {currentPage === "info" && <DoctorInfoContainer />}
          {currentPage === "visualization2" && <Visualization2 />}
          {currentPage === "visualization3" && <Visualization3 />}
          {currentPage === "visualization1" && <Visualization1 />}
          {currentPage === "visualization4" && <Visualization4 />}
          {currentPage === "visualization5" && <Visualization5 />}
          {currentPage === "visualization6" && <Visualization6 />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
