import cookie from "@/utils/cookie";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, {useState} from "react";

import styles from "./index.module.scss";

export default function Logout(): React.ReactElement {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const logout = () => {
    cookie.delCookie("token");
    location.pathname = "/sign-in";
  };

  return (
    <div className={styles.logout}>
      <Button variant="outlined" onClick={handleOpen}>
        logout
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure to logout?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This operation will clear your login status.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{padding: "16px 24px"}}>
          <Button onClick={handleClose}
                  variant="outlined">
            Cancel
          </Button>
          <Button onClick={logout} color="error"
                  variant="outlined">
            logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
