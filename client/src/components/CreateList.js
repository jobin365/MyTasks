import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import ListTitle from "./ListTitle";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import LoadingSpin from "react-loading-spin";
import "./CreateList.css";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
function CreateList(props) {
  const [userInput, setUserInput] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);
  const [showAlert,setShowAlert]=useState(false);

  function handleTextChange(event) {
    setUserInput(event.target.value);
  }

  function handleUserClick() {
    if(userInput===""){
      setShowAlert(true);
    }else{
      setButtonVisible(false);
      props.createList(userInput);
    }
  }
  return (
    <div style={{display:"flex",justifyContent:"center",flexWrap :"wrap",width:"400px"}}>
      <ListTitle listName="Create List" />
      <Paper
        elevation={3}
        className="createListTopContainer"
        style={{
          paddingTop:"25px",
          paddingBottom:"25px",
          margin: "25px 0 0",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap:"wrap"
        }}
      >
        <TextField
          className="newListInput"
          label="Add list"
          value={userInput}
          onChange={handleTextChange}
          variant="outlined"
        />
        {buttonVisible ? (
          <Fab color="primary" aria-label="add" onClick={handleUserClick}>
            <AddIcon />
          </Fab>
        ) : (
          <LoadingSpin size="30px" />
        )}
        <div style={{width:"350px",height:"50px",display:"flex",alignItems:"center",marginTop:"20px",justifyContent:"space-between"}}>
        
        <div>
        <span style={{color:"#1565c0",textAlign:"left"}} className="usernameInfo">Logged in as {props.username}</span>
        </div>
        <Button className="logoutButtonEmptyList" variant="contained" style={{backgroundColor:"#D61C4E"}} onClick={props.logout}>
            Logout
        </Button>
        </div>
        {showAlert&&<Alert severity="warning" style={{marginTop:"25px"}}>List name cant be empty</Alert>}
      </Paper>
    </div>
  );
}

export default CreateList;
