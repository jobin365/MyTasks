import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import "./ListEdit.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function ListEdit(props) {

  function handleChange(event) {
    props.listChange(event.target.value);
  }

  return (
    <Paper className="listEdit" elevation={3}>
      <FormControl variant="outlined" style={{ width: "225px" }}>
        <InputLabel id="demo-simple-select-label">List</InputLabel>
          <Select
          labelId="demo-simple-select-label"
          value={props.selectedID}
          label="List"
          onChange={handleChange}
        >
          {props.listList.map((list, index) => {
              return (
                <MenuItem value={list._id} key={index}>
                  {list.name}
                </MenuItem>
              );
            })}
        </Select>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: "35px",
          }}
        >
          <Button className="buttons" variant="contained" onClick={props.handleAddIcon}>
            <AddIcon />
          </Button>
          <Button className="buttons" variant="contained" onClick={props.handleEditIcon}>
            <EditIcon />
            </Button>
          <Button className="buttons" variant="contained" onClick={props.handleDeleteIcon}>
            <DeleteIcon />
            </Button>
          
        </div>
        <Button className="logoutButton" variant="contained" style={{marginTop:"20px",backgroundColor:"#D61C4E"}} onClick={props.logout}>
            Logout
        </Button>
        <span className="usernameInfo">{props.username}</span>
      </FormControl>
    </Paper>
  );
}

export default ListEdit;
