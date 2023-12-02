import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import SpecialityContainer from "../../components/admin/speciality/SpecialityContainer";
import DepartmentContainer from "../../components/admin/department/DepartmentContainer";
import RoomContainer from "../../components/admin/room/RoomContainer";
import DoctorContainer from "../../components/admin/doctor/DoctorContainer";
import ClientContainer from "../../components/admin/client/ClientContainer";

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
            padding: "16px"
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Button
                variant={currentPage === "department" ? "contained" : "outlined"}
                onClick={() => changePage("department")}
                fullWidth
              >
                Відділи
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "speciality" ? "contained" : "outlined"}
                onClick={() => changePage("speciality")}
                fullWidth
              >
                Спеціальності
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "room" ? "contained" : "outlined"}
                onClick={() => changePage("room")}
                fullWidth
              >
                Кабінети
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "doctor" ? "contained" : "outlined"}
                onClick={() => changePage("doctor")}
                fullWidth
              >
                Лікарі
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={currentPage === "client" ? "contained" : "outlined"}
                onClick={() => changePage("client")}
                fullWidth
              >
                Клієнти
              </Button>
            </Grid>
          </Grid>
        </div>

        <div style={{ padding: "16px" }}>
          {currentPage === "department" && <DepartmentContainer />}
          {currentPage === "speciality" && <SpecialityContainer />}
          {currentPage === "room" && <RoomContainer />}
          {currentPage === "doctor" && <DoctorContainer />}
          {currentPage === "client" && <ClientContainer />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
