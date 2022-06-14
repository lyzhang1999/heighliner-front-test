import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {Button, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import {useState} from "react";
import {NoticeRef} from "@/components/Notice";
import {createOrg} from "@/utils/api/org";

interface Props {
  open: boolean,
  setOpen: (val: boolean) => void,
  successCb: () => void,
}

const CreateOrganization = ({open, setOpen, successCb}: Props) => {
  const [name, setName] = useState<string>('');

  const handleClose = () => {
    setOpen(false);
    setName('');
  };

  function checkName(): string {
    if (name.length > 20) {
      return "the max length is 20";
    }
    if (name.length < 5) {
      return "the min length is 5";
    }
    if (!/^[-_a-zA-Z0-9]{5,20}$/.test(name)) {
      return "contains only letters and digits"
    }
    return '';
  }

  function creat() {
    let errmsg = checkName();
    if (errmsg) {
      NoticeRef.current?.open({
        message: errmsg,
        type: "error",
      });
    } else {
      createOrg(name).then(res => {
        NoticeRef.current?.open({
          message: "Creat Organization Success",
          type: "success",
        });
        successCb();
        setName('');
        setOpen(false);
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Please Input a Organization Name
      </DialogTitle>
      <DialogContent>
        <TextField id="outlined-basic" label="Name" variant="outlined"
                   value={name}
                   onChange={(e) => {
                     setName(e.target.value);
                   }}
                   sx={{
                     width: "100%",
                     margin: "20px 0"
                     // '& .MuiTextField-root': {marginTop: "20px", width: '100%'},
                   }}
                   error={Boolean(name && checkName())}
                   helperText={name && checkName()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={creat} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateOrganization;
