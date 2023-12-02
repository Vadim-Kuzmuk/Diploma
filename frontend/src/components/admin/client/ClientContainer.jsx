import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchFilterData, checkFilterItem } from "../../../utils/fetchFilterData.js";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import ClientList from "./ClientList";
import { Pagination, Typography } from "@mui/material";

const ClientContainer = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [clients, setClients] = useState(null);

  const [filterData, setFilterData] = useState({
    "page": checkFilterItem(searchParams, "page", 1, true),
    "title": checkFilterItem(searchParams, "title", null)
  });

  const fetchClients = () => {
    let filterUrl = fetchFilterData(filterData);
    navigate(filterUrl);

    axios.get("/api/client-infos" + filterUrl + "&itemsPerPage=" + paginationInfo.itemsPerPage, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK && response.data["hydra:member"]) {
        setClients(response.data["hydra:member"]);
        setPaginationInfo({
          ...paginationInfo,
          totalItems: response.data["hydra:totalItems"],
          totalPageCount: Math.ceil(response.data["hydra:totalItems"] / paginationInfo.itemsPerPage)
        });
      }
    }).catch(error => {
      console.log("error");
    });
  };

  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: null,
    totalPageCount: null,
    itemsPerPage: 4
  });

  useEffect(() => {
    fetchClients();
  }, [filterData]);

  const onChangePage = (event, page) => {
    setFilterData({ ...filterData, page: page });
  };

  return (
    <>
      <Helmet>
        <title>
          Клієнти
        </title>
      </Helmet>
      <Typography variant="h4" component="h1" mb={1}>
        Клієнти
      </Typography>
      <ClientList
        clients={clients}
      />
      {paginationInfo.totalPageCount &&
        <Pagination
          count={paginationInfo.totalPageCount}
          shape="rounded"
          page={filterData.page}
          onChange={(event, page) => onChangePage(event, page)}
        />}
    </>
  );
};

export default ClientContainer;
