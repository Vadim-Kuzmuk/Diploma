import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import { Typography, Grid } from "@mui/material";
import Notification from "../../elements/notification/Notification";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const WorkContainer = () => {
  const [projectData, setProjectData] = useState([]);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    axios.get("/api/works", userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        const projects = ["Project A", "Project B", "Project C", "Project D"];

        const projectData = projects.map(project => {
          const projectWorkData = response.data["hydra:member"].filter(work => work.title === project);

          const groupedUserData = projectWorkData.reduce((acc, work) => {
            const userId = work.user.id;

            if (!acc[userId]) {
              acc[userId] = {
                userId,
                lastName: work.user.lastName,
                totalSeconds: 0,
              };
            }

            acc[userId].totalSeconds += parseInt(work.seconds, 10);

            return acc;
          }, {});

          const totalSeconds = projectWorkData.reduce((acc, work) => acc + parseInt(work.seconds, 10), 0);

          return {
            project,
            userData: Object.values(groupedUserData),
            totalSeconds,
          };
        });

        setProjectData(projectData);
      }
    }).catch(error => {
      console.log("error", error);
    });
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ff7f0e", "#2196f3"];

  return (
    <>
      <Helmet>
        <title>Звітність</title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Typography variant="h4" component="h1" mb={1}>
        Звітність
      </Typography>
      <Grid container spacing={3}>
        {projectData.map((project, index) => (
          <Grid item key={index} xs={12} sm={6} md={6} lg={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" mb={1}>
              {project.project}
            </Typography>
            {project.userData.length > 0 && (
              <PieChart width={600} height={300}>
                <Pie
                  dataKey="totalSeconds"
                  data={project.userData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ payload }) => `${payload.lastName}: ${payload.totalSeconds} сек.`}
                >
                  {project.userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }}
                  labelStyle={{ color: "red" }}
                  formatter={(value) => [`${(value / project.totalSeconds * 100).toFixed(2)}%`]}
                />
              </PieChart>
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default WorkContainer;
