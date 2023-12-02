import React, { useContext } from "react";
import { AppContext } from "../../../App";
import Can from "../can/Can";
import { appoint } from "../../../rbac-consts";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import { AccountBoxOutlined, LogoutOutlined } from "@mui/icons-material";
import eventBus from "../../../utils/eventBus";

const Header = () => {
  const { user } = useContext(AppContext);
  const location = useLocation();

  const headerButtonStyle = {
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow: "unset"
  };

  return <div
    style={{
      position: "fixed",
      top: "0",
      left: "0",
      height: "60px",
      width: "100vw",
      zIndex: "10000",
      marginTop: "0px",
      padding: "0 20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#1976D2",
      boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.25)"
    }}
  >
    <Link to="">
      <Typography
        sx={{
          color: '#f0f0f0'
        }}
        variant="h4"
      >
        Healthy
      </Typography>
    </Link>
    <div style={{display: 'flex'}}>
      {
        user == null && location.pathname != "/login" &&
        <Button
          variant="contained"
          style={headerButtonStyle}
          to="/login"
          component={NavLink}
        >
          Увійти
        </Button>
      }
      <Can
        role={user?.roles}
        perform={appoint.CLIENT}
        yes={() =>
          <>
            <Button
              variant="contained"
              style={headerButtonStyle}
              to="/cabinet"
              component={NavLink}
            >
              <AccountBoxOutlined fontSize="large"/>
            </Button>
            <Button
              variant="contained"
              style={headerButtonStyle}
              to=""
              onClick={() => eventBus.dispatch("logout")}
              component={NavLink}
            >
              <LogoutOutlined fontSize="large"/>
            </Button>
          </>
        }
      />
      <Can
        role={user?.roles}
        perform={appoint.ADMIN}
        yes={() =>
          <>
            <Button
              variant="contained"
              style={headerButtonStyle}
              to="/admin-panel"
              component={NavLink}
            >
              <AccountBoxOutlined fontSize="large"/>
            </Button>
            <Button
              variant="contained"
              style={headerButtonStyle}
              to=""
              onClick={() => eventBus.dispatch("logout")}
              component={NavLink}
            >
              <LogoutOutlined fontSize="large"/>
            </Button>
          </>
        }
      />
      <Can
        role={user?.roles}
        perform={appoint.DOCTOR}
        yes={() =>
          <>
            <Button
              variant="contained"
              style={headerButtonStyle}
              to="/doctor-cabinet"
              component={NavLink}
            >
              <AccountBoxOutlined fontSize="large"/>
            </Button>
            <Button
              variant="contained"
              style={headerButtonStyle}
              to=""
              onClick={() => eventBus.dispatch("logout")}
              component={NavLink}
            >
              <LogoutOutlined fontSize="large"/>
            </Button>
          </>
        }
      />
    </div>
  </div>;
};

export default Header;
