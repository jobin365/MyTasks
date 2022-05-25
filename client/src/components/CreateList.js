import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import ListTitle from "./ListTitle";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import LoadingSpin from "react-loading-spin";
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
    <div>
      <ListTitle listName="Create List" />
      <Paper
        elevation={3}
        style={{
          height: "100px",
          width: "400px",
          margin: "25px 0 0",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <TextField
          style={{ width: "270px" }}
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
