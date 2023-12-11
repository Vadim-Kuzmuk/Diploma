import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import { Typography, Grid } from "@mui/material";
import Notification from "../../elements/notification/Notification";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

function formatHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return `${hours} год. ${remainingMinutes} хв.`;
}

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
                totalHours: 0,
              };
            }

            acc[userId].totalSeconds += parseInt(work.seconds, 10);
            acc[userId].totalHours += parseInt(work.hours, 10);

            return acc;
          }, {});

          const totalSeconds = projectWorkData.reduce((acc, work) => acc + parseInt(work.seconds, 10), 0);
          const totalHours = projectWorkData.reduce((acc, work) => acc + parseInt(work.hours, 10), 0);

          let specifiedTotalSeconds;
          switch (project) {
            case "Project A":
              specifiedTotalSeconds = 220;
              break;
            case "Project B":
              specifiedTotalSeconds = 460;
              break;
            case "Project C":
              specifiedTotalSeconds = 525;
              break;
            case "Project D":
              specifiedTotalSeconds = 180;
              break;
            default:
              specifiedTotalSeconds = 1000;
          }

          return {
            project,
            userData: Object.values(groupedUserData),
            totalSeconds,
            totalHours,
            specifiedTotalSeconds,
          };
        });

        setProjectData(projectData);
      }
    }).catch(error => {
      console.log("error", error);
    });
  }, []);

  const COLORS = ["#9f9f9f", "#47ce78"];

  const remainingHours = projectData.map(project => {
    const remainingPercentage = ((project.specifiedTotalSeconds - project.totalSeconds) / project.specifiedTotalSeconds * 100).toFixed(2);
    const percentage = (project.totalSeconds / project.specifiedTotalSeconds * 100).toFixed(2);
    const totalHours = project.totalHours;
    const calculatedRemainingHours = ((totalHours * remainingPercentage) / percentage).toFixed(2);
    return formatHours(calculatedRemainingHours * 60);
  });

  return (
    <>
      <Helmet>
        <title>Прогнозування</title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Typography variant="h4" component="h1" mb={1}>
        Прогнозування
      </Typography>
      <Grid container spacing={3}>
        {projectData.map((project, index) => (
          <Grid item key={index} xs={12} sm={6} md={6} lg={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" mb={1}>
              {project.project}
            </Typography>
            {project.userData.length > 0 && (
              <PieChart width={600} height={280}>
                <Pie
                  dataKey="totalSeconds"
                  data={[
                    { totalSeconds: project.totalSeconds },
                    { totalSeconds: project.specifiedTotalSeconds - project.totalSeconds }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill={COLORS[0]}
                  label={`Усього: ${project.totalSeconds} сек.`}
                >
                  <Cell fill={COLORS[1]} />
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }}
                  labelStyle={{ color: "red" }}
                  formatter={(value, name, props) => {
                    if (name === 'totalSeconds') {
                      const remainingPercentage = ((project.specifiedTotalSeconds - props.payload.totalSeconds) / project.specifiedTotalSeconds * 100).toFixed(2);
                      return [`${remainingPercentage}%`];
                    } else {
                      const percentage = (props.payload.totalSeconds / project.specifiedTotalSeconds * 100).toFixed(2);
                      return [`${percentage}%`];
                    }
                  }}
                />
              </PieChart>
            )}
            {project.userData.length > 0 && (
              <Typography variant="body1" color="textPrimary">
                Загальна кількість годин витрачених на проект: {project.totalHours}.
                <br />
                Прогноз годин які ще потрібно витратити: {remainingHours[index]}.
              </Typography>
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default WorkContainer;
