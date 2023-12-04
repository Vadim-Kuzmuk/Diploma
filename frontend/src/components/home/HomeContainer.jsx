import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notification from "../elements/notification/Notification";

const HomeContainer = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    visible: false,
    type: "",
    message: ""
  });

  return (
    <>
      <Helmet>
        <title>
          Головна
        </title>
      </Helmet>
      {notification.visible &&
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      }
      <div
        style={{
          position: "absolute",
          margin: "-25px",
          width: "100vw",
          height: "calc(100vh - 60px)",
          zIndex: "100",
          display: "flex",
          flexDirection: "row"
        }}
      >
        {/* add here registration from */}
      </div>
    </>
  );

};

export default HomeContainer;