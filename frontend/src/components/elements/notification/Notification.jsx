import { Alert, Snackbar } from "@mui/material";

const Notification = ({ notification, setNotification }) => {
  const handleCloseAlert = () => {
    setNotification({ ...notification, visible: false });
  };

  return (
    <Snackbar
      style={{zIndex: "100000"}}
      anchorOrigin={{ vertical: "top", horizontal: "center" }} open={notification.visible} onClose={handleCloseAlert}
    >
      <Alert
        sx={{
          boxShadow: 3
        }}
        severity={notification.type}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;