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
import { checkFilterItem, fetchFilterData } from "../../../utils/fetchFilterData";
import { useNavigate, useSearchParams } from "react-router-dom";

const WorkContainer = () => {
  const [works, setWorks] = useState([]);
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [filterData, setFilterData] = useState({
    "page": checkFilterItem(searchParams, "page", 1, true),
    "title": checkFilterItem(searchParams, "title", null)
  });

  useEffect(() => {

    let filterUrl = fetchFilterData(filterData);

    navigate(filterUrl);

    axios.get("/api/works" + filterUrl + "&itemsPerPage=" + paginationInfo.itemsPerPage, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        const groupedWorks = _.groupBy(response.data["hydra:member"], "user.id");
        const aggregatedWorks = [];

        for (const userId in groupedWorks) {
          const user = groupedWorks[userId][0].user;
          const totalHours = _.sumBy(groupedWorks[userId], work => parseInt(work.hours, 10));

          aggregatedWorks.push({
            user: { ...user, hours: totalHours }
          });
        }

        setWorks(aggregatedWorks);

        setPaginationInfo({
          ...paginationInfo,
          totalItems: response.data["hydra:totalItems"],
          totalPageCount: Math.ceil(response.data["hydra:totalItems"] / paginationInfo.itemsPerPage)
        });
      }
    }).catch(error => {
      console.log("error", error);
    });
  }, []);

  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: null,
    totalPageCount: null,
    itemsPerPage: 500
  });

  return (
    <>
      <Helmet>
        <title>
          Відпрацьвано годин
        </title>
      </Helmet>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Typography variant="h4" component="h1" mb={1}>
        Відпрацьвано годин
      </Typography>
      <LineChart width={1600} height={768} data={works}>
        <XAxis dataKey="user.lastName" label={{ value: "", position: "insideBottom", offset: -10 }} />
        <YAxis label={{ value: "Години роботи", angle: -90, position: "insideLeft" }} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="user.hours" stroke="#4239e6" name="Години роботи" />
        <Tooltip labelStyle={{ color: "red" }} />
        <Legend
          wrapperStyle={{ paddingTop: "20px", fontWeight: "bold", color: "blue" }}
        />
      </LineChart>
    </>
  );
};

export default WorkContainer;
