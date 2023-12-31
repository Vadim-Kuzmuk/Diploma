import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig";
import { responseStatus } from "../../../utils/consts";
import VisitsList from "./VisitsList";

const PlannedVisitsContainer = () => {

  const [visits, setVisits] = useState();
  const [filterData, setFilterData] = useState({ page: 1 });

  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: 0,
    totalPageCount: 0,
    itemsPerPage: 5,
    page: 1
  });

  const fetchPlannedVisits = () => {

    const { id } = jwt_decode(localStorage.getItem("token"));
    axios.get("/api/doctor-planned-visits/" + id + `?itemsPerPage=${paginationInfo.itemsPerPage}&
    page=${filterData.page}`, userAuthenticationConfig()).then(response => {
      if (response.status === responseStatus.HTTP_OK) {
        setVisits(response.data["hydra:member"][1]);
        setPaginationInfo({
          ...paginationInfo,
          totalItems: response.data["hydra:member"][0],
          totalPageCount: Math.ceil(response.data["hydra:member"][0] / paginationInfo.itemsPerPage)
        });
      }
    }).catch(
      error => {
        console.log("error fetching visits");
      }
    );
  };

  useEffect(() => {
    fetchPlannedVisits();
  }, []);

  useEffect(() => {
    fetchPlannedVisits();
  }, [filterData]);

  return <VisitsList
    visits={visits}
    paginationInfo={paginationInfo}
    filterData={filterData}
    setFilterData={setFilterData}
  />;
};

export default PlannedVisitsContainer;