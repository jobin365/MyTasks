import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import ListTitle from "./ListTitle";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import LoadingSpin from "react-loading-spin";
import "./CreateList.css"
function CreateList(props) {
  const [userInput, setUserInput] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);

  function handleTextChange(event) {
    setUserInput(event.target.value);
  }

  function handleUserClick() {
    setButtonVisible(false);
    props.createList(userInput);
  }
  return (
    <div style={{display:"flex",justifyContent:"center",flexWrap :"wrap"}}>
      <ListTitle listName="Create List" />
      <Paper
        elevation={3}
        className="createListTopContainer"
        style={{
          height: "100px",
          margin: "25px 0 0",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <TextField
          className="newListInput"
          label="Add list"
          value={userInput}
          onChange={handleTextChange}
          variant="standard"
        />
        {buttonVisible ? (
          <Fab color="primary" aria-label="add" onClick={handleUserClick}>
            <AddIcon />
          </Fab>
        ) : (
          <LoadingSpin size="30px" />
        )}
      </Paper>
    </div>
  );
}

export default CreateList;
