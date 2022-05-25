import React from "react";
import Paper from "@mui/material/Paper";
import "./ListTitle.css";
function ListTitle(props) {

  return (
      <Paper
        elevation={3}
        className="listTitle"
        style={{ backgroundColor: "#9A86A4", color: "white" }}
      >
        {props.listName}
      </Paper>
  );
}

export default ListTitle;
