import { Pagination, Typography } from "@mui/material";
import React from "react";
import VisitsItem from "./VisitsItem";

const VisitsList = ({
  visits,
  paginationInfo,
  filterData,
  setFilterData
}) => {

  return <>
    {(!visits || visits.length === 0) &&
      <Typography
        variant="p"
        sx={{
          color: "#a0a0a0",
          margin: "5px"
        }}
      >
        Прийоми відсутні
      </Typography>
    }
    {visits && visits.map((visit, key) => (
      <VisitsItem visit={visit} key={key} />
    ))}
    {paginationInfo.totalPageCount && paginationInfo.totalPageCount > 1 &&
      <Pagination
        count={paginationInfo.totalPageCount}
        shape="rounded"
        page={filterData.page}
        onChange={(event, page) => setFilterData({ page: page })}
      />}
  </>;
};

export default VisitsList;