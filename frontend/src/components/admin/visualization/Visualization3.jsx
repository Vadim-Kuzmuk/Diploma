import React, { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import { Typography } from "@mui/material";
import Notification from "../../elements/notification/Notification";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const WorkContainer = () => {
  const [works, setWorks] = useState([]);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    axios.get("/api/works", userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        const groupedWorks = _.groupBy(response.data["hydra:member"], "user.id");
        const aggregatedWorks = [];

        for (const userId in groupedWorks) {
          const user = groupedWorks[userId][0].user;
          const totalSeconds = _.sumBy(groupedWorks[userId], work => work.seconds);

          aggregatedWorks.push({
            user: { ...user, seconds: totalSeconds }
          });
        }

        setWorks(aggregatedWorks);
      }
    }).catch(error => {
      console.log("error", error);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>
          Створено секунд
        </title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Typography variant="h4" component="h1" mb={1}>
        Створено секунд
      </Typography>
      <LineChart width={1600} height={768} data={works}>
        <XAxis dataKey="user.lastName" label={{ value: "", position: "insideBottom", offset: -10 }} />
        <YAxis label={{ value: "Години роботи", angle: -90, position: "insideLeft" }} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="user.seconds" stroke="#00a640" name="Секунди відео" />
        <Tooltip labelStyle={{ color: "red" }} />
        <Legend
          wrapperStyle={{ paddingTop: "20px", fontWeight: "bold", color: "blue" }}
        />
      </LineChart>
    </>
  );
};

export default WorkContainer;
