import React, { useState } from "react";
import ClientVisitCard from "./ClientVisitCard";
import { Modal, Pagination } from "@mui/material";
import ClientVisitDetails from "./ClientVisitDetails";
import { dateToTimestamp } from "../../../utils/timestampUtil";

const ClientVisitsList = ({ visits, setPayId, paginationInfo, filterData, setFilterData, setCancelId }) => {
  const [modal, setModal] = useState({ visible: false, content: <></> });

  console.log(paginationInfo);

  return <>
    <Modal
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "50000"
      }}
      open={modal.visible}
      onClose={() => {setModal({ visible: false, content: <></> });}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {modal.content}
    </Modal>
    <div
      style={{
        margin: "auto",
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        alignItems: "center"
      }}
    >

      {visits && visits.map((visit, key) =>
        <ClientVisitCard visit={visit} key={key} setModal={setModal} setPayId={setPayId} setCancelId={setCancelId} />)}
      {paginationInfo.totalPageCount < 1 && <>
        Записів немає
      </>
      }
      {paginationInfo.totalPageCount > 1 && <>
        <Pagination
          count={paginationInfo.totalPageCount}
          shape="rounded"
          page={filterData.page}
          onChange={(event, page) => setFilterData({ ...filterData, page: page })}
        />
      </>
      }
    </div>
  </>;
};

export default ClientVisitsList;