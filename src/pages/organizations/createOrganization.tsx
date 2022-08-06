import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {Button, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import {useState} from "react";
import {createOrg} from "@/api/org";
import {Message} from "@/utils/utils";

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
    if (!/^[a-zA-Z0-9_-]{5,20}$/.test(name)) {
      return `contains only "_", "-", uppercase, lowercase and numbers`;
    }
    return '';
  }

  function creat() {
    let errmsg = checkName();
    if (errmsg) {
      Message.error(errmsg)
    } else {
      createOrg(name).then(res => {
        Message.success('Creat Organization Success');
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
        Please Input Organization Name
      </DialogTitle>
      <DialogContent>
        <TextField id="outlined-basic" label="Organization Name" variant="outlined"
                   value={name}
                   onChange={(e) => {
                     setName(e.target.value);
                   }}
                   sx={{
                     width: "100%",
                     marginTop: "10px"
                   }}
                   error={Boolean(name && checkName())}
                   helperText={name && checkName()}
                   onKeyPress={(e) => {
                     if (e.charCode === 13) {
                       creat();
                     }
                   }}
        />
      </DialogContent>
      <DialogActions
        sx={{padding: '16px 24px'}}
      >
        <Button onClick={handleClose}
                variant="outlined"
        >Cancel</Button>
        <Button onClick={creat}
                variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateOrganization;
