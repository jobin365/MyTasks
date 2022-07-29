import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import "./ItemList.css";

function ItemList(props) {
  const [userInput,setUserInput]=useState("");
  const [userHovering,setUserHovering]=useState(-1);

  function handleChange(event){
    props.deleteItem(event.target.value);
    setUserHovering(-1);
  }

  function handleTextChange(event){
    setUserInput(event.target.value);
  }

  function handleClick(){
    props.addItem(userInput);
    setUserInput("");
  }

  function handleMouseOver(event){
    setUserHovering(event.target.value);
  }

  function handleMouseOut(event){
    setUserHovering(-1);
  }

  return (
    <Paper className="itemListTopContainer" elevation={3} style={{ margin: "25px 0 0" }}>
      <List>
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <TextField
            className="listItemInput"
            label="Add item"
            value={userInput}
            onChange={handleTextChange}
            variant="outlined"
          />
          <Fab color="primary" aria-label="add" onClick={handleClick}>
            <AddIcon />
          </Fab>
        </ListItem>

        {props.listItems.map((item, index) => {
            return (
              <ListItem key={index}>
                <ListItemIcon>
                  <Checkbox onChange={handleChange} value={index} checked={userHovering==index?true:false} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}/>
                </ListItemIcon>
                <ListItemText>{item}</ListItemText>
              </ListItem>
            );
          })}
      </List>
    </Paper>
  );
}

export default ItemList;
