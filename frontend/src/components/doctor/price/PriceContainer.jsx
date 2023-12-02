import axios from "axios";
import { responseStatus } from "../../../utils/consts.js";
import userAuthenticationConfig from "../../../utils/userAuthenticationConfig.js";
import React, { useEffect, useState } from "react";
import PriceList from "./PriceList";
import { Button, Grid, Input, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import jwt_decode from "jwt-decode";
import DoctorPersonalInfoContainer from "../info/DoctorPersonalInfoContainer";

const PriceContainer = (
  visitPrice,
  consultationPrice,
  setAppointModalOpen
) => {
  const [formData, setFormData] = useState({
    consultationPrice: visitPrice.consultationPrice,
    visitPrice: visitPrice.visitPrice
  });

  const clearFormFields = () => {
    const clearedFormData = {
      consultationPrice: "",
      visitPrice: ""
    };
    setFormData(clearedFormData);
  };

  const [prices, setPrices] = useState(null);
  const [doctorInfoId, setDoctorInfoId] = useState(null);

  const fetchPrices = () => {
    const { id } = jwt_decode(localStorage.getItem("token"));
    axios.get(`/api/doctor-infos`, userAuthenticationConfig()).then((response) => {
      if (
        response.status === responseStatus.HTTP_OK &&
        response.data["hydra:member"]
      ) {
        const doctorInfo = response.data["hydra:member"].find(
          (doctor) => doctor.user.id === id.replace("0x", "")
        );

        const prices = {
          consultationPrice: doctorInfo.consultationPrice,
          visitPrice: doctorInfo.visitPrice,
          operationPrice: doctorInfo.operationPrice
        };
        setPrices(prices);
        setDoctorInfoId(doctorInfo.id);
      }
    }).catch(error => {
      console.error("Помилка отримання цін:", error);
    });
  };
  const updatePrices = () => {
    if (!doctorInfoId) {
      console.error("doctorInfoId не визначено");
      return;
    }

    const updatedPrices = {
      consultationPrice: formData.consultationPrice,
      visitPrice: formData.visitPrice,
      operationPrice: formData.operationPrice
    };

    axios.patch(`/api/doctor-infos/${doctorInfoId}`, updatedPrices, userAuthenticationConfig()).then((response) => {
      console.log("Response:", response);
      if (response.status === responseStatus.HTTP_OK) {
        console.log("Ціни оновлені успішно.");
        fetchPrices();
      }
    }).catch(error => {
      console.error("Помилка оновлення цін:", error);
    });
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <>
      {/*<PriceList prices={prices} />*/}
      <div>
        <Typography>Ціна консультації: </Typography>
        <Input
          label="Ціна консультації"
          type="number"
          defaultValue={visitPrice.consultationPrice}
          onLoad
          onChange={(e) => {
            if (e.target.value <= 0) {
              e.target.value = 0;
            }
            setFormData({ ...formData, consultationPrice: e.target.value });
          }}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Typography>Ціна прийому: </Typography>
        <Input
          type="number"
          defaultValue={visitPrice.visitPrice}
          onChange={(e) => {
            if (e.target.value <= 0) {
              e.target.value = 0;
            }
            setFormData({ ...formData, visitPrice: e.target.value });
          }}
          variant="outlined"
          fullWidth
          margin="normal"
        />

        {/*<TextField*/}
        {/*  label="Ціна операції"*/}
        {/*  type="number"*/}
        {/*  value={formData.operationPrice}*/}
        {/*  onChange={(e) => setFormData({ ...formData, operationPrice: e.target.value })}*/}
        {/*  variant="outlined"*/}
        {/*  fullWidth*/}
        {/*  margin="normal"*/}
        {/*/>*/}

        <Button
          variant="contained"
          color="primary"
          onClick={updatePrices}
        >
          Оновити ціни
        </Button>
      </div>
    </>
  );
};

export default PriceContainer;
