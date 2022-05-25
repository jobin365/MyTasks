import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Fab from "@mui/material/Fab";
import DoneIcon from '@mui/icons-material/Done';

export default function NameInputModal(props) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      const [userInput,setUserInput]=useState("");

    function handleButtonClick(){
        props.handleOKButtonClick(userInput);
        setUserInput("");
    }

    function handleUserInputChange(event){
        setUserInput(event.target.value);
    }
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <TextField value={userInput} variant="standard" style={{ width: "210px" }} label="List Name" onChange={handleUserInputChange}/>
          <Fab color="primary" aria-label="add" onClick={handleButtonClick}>
            <DoneIcon />
          </Fab>
        </div>
      </Box>
    </Modal>
  );
}
