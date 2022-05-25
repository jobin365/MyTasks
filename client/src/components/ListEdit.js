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

function ListEdit(props) {

  function handleChange(event) {
    props.listChange(event.target.value);
  }

  return (
    <Paper className="listEdit" elevation={3}>
      <FormControl variant="standard" style={{ width: "200px" }}>
        <InputLabel id="demo-simple-select-label">List</InputLabel>
          <Select
          labelId="demo-simple-select-label"
          value={props.selectedID}
          label="List"
          onChange={handleChange}
        >
          {props.listList.map((list, index) => {
              return (
                <MenuItem value={list.id} key={index}>
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
          <Fab color="primary" aria-label="add" onClick={props.handleAddIcon}>
            <AddIcon />
          </Fab>
          <Fab color="primary" aria-label="add" onClick={props.handleEditIcon}>
            <EditIcon />
          </Fab>
          <Fab color="primary" aria-label="add" onClick={props.handleDeleteIcon}>
            <DeleteIcon />
          </Fab>
        </div>
      </FormControl>
    </Paper>
  );
}

export default ListEdit;
