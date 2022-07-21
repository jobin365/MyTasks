import React, { useState } from "react";
import ListTitle from "./ListTitle";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import "./RegisterOrLogin.css";
import Button from "@mui/material/Button";

export default function RegisterOrLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        width: "400px",
      }}
    >
      <ListTitle listName="Register/Login" />
      <Paper
        elevation={3}
        className="roltopContainer"
        style={{
          padding: "25px",
          margin: "25px 0 0",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          style={{ marginBottom: "20px" }}
          className="username"
          label="Username"
          value={username}
          onChange={handleUsernameChange}
          variant="standard"
        />
        <TextField
          style={{ marginBottom: "20px" }}
          className="password"
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          variant="standard"
        />
      </Paper>
      <div className="lorButtons">
        <Button className="lorButton" variant="contained">
          Login
        </Button>
        <Button className="lorButton" variant="contained">
          Register
        </Button>
      </div>
    </div>
  );
}
