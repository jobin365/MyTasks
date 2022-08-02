import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Fab from "@mui/material/Fab";
import DoneIcon from '@mui/icons-material/Done';
import Alert from '@mui/material/Alert';

export default function NameInputModal(props) {
    const [showAlert,setShowAlert]=useState(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "300px",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display:"flex",
        justifyContent:"center",
        flexWrap:"wrap",
        padding:"20px"
      };
      const [userInput,setUserInput]=useState("");

    function handleButtonClick(){
      if(userInput===""){
        setShowAlert(true);
      }else{
        props.handleOKButtonClick(userInput);
        setUserInput("");
        setShowAlert(false);
      }
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
            justifyContent: "space-around",
            flexWrap: "wrap",
            width:"300px"
          }}
        >
          <TextField value={userInput} variant="outlined" style={{ width: "210px" }} label="List Name" onChange={handleUserInputChange}/>
          <Fab color="primary" aria-label="add" onClick={handleButtonClick}>
            <DoneIcon />
          </Fab>
        </div>
        {showAlert&&<Alert severity="warning" style={{marginTop:"25px"}}>List name cant be empty</Alert> }
      </Box>
    </Modal>
  );
}
