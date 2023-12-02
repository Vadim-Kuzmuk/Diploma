import {
  Button,
  Card,
  CardContent, Input,
  Modal, Typography
} from "@mui/material";
import React from "react";
import PriceContainer from "../price/PriceContainer";
import DoctorDurationEditContainer from "../duration/DoctorDurationEditContainer";

const DoctorInfoEditModal = ({
  appointModalOpen, setAppointModalOpen,
  consultationPrice,
  visitPrice,
  duration,
  setNotification
}) => {

  return <>
    <Modal
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "50000"
      }}
      open={appointModalOpen}
      onClose={() => {setAppointModalOpen(false);}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card
        style={{
          minWidth: "400px",
          padding: "10px"
        }}
      >
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          <PriceContainer
            visitPrice={visitPrice}
            consultationPrice={consultationPrice}
            setAppointModalOpen = {setAppointModalOpen}
          />
          <DoctorDurationEditContainer duration={duration} setNotification={setNotification}/>
        </CardContent>
      </Card>
    </Modal>
  </>;

};

export default DoctorInfoEditModal;