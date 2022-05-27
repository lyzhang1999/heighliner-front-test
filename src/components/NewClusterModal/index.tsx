import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

import React, {useEffect, useState} from "react";
import styles from './index.module.scss';
import hljs from 'highlight.js';
import yaml from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/a11y-dark.css' // 导入代码高亮样式

interface Props {
  modalDisplay: boolean
  setModalDispay: (dispaly: any) => void,
  modalConfirm?: () => {}
}

const NewClusterModal = ({modalDisplay, setModalDispay, modalConfirm}: Props) => {
  // useEffect(() => {
  //   if (modalDisplay) {
  //     setTimeout(() => {
  //       let dom = document.querySelector("#heightWrapper")
  //       console.warn(dom);
  //       hljs.highlightElement(dom);
  //       hljs.registerLanguage('yaml', yaml);
  //
  //     }, 1000)
  //   }
  // }, [modalDisplay])

  const [value, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Dialog
        open={modalDisplay}
        onClose={() => setModalDispay(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Create a new Cluster
        </DialogTitle>
        <DialogContent>
          <div className={styles.content}>
            <Box
              component="form"
              sx={{
                width: "100%",
                '& .MuiTextField-root': {marginTop: "20px", width: '100%'},
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Name"
                  multiline
                  maxRows={4}
                  value={value}
                  defaultValue=""
                  onChange={handleChange}
                />
              </div>
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="Kube Config"
                  multiline
                  rows={6}
                  defaultValue=""
                />
              </div>
            </Box>
            {/*<div id="heightWrapper">*/}
            {/*  test*/}
            {/*</div>*/}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalDispay(false)}>Cancel</Button>
          <Button
            onClick={modalConfirm}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}


export default NewClusterModal;
