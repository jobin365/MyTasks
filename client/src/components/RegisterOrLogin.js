import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import "./RegisterOrLogin.css";
import Button from "@mui/material/Button";
import Axios from "axios";
import Alert from '@mui/material/Alert';

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert,setShowAlert]=useState(false);
  const [errorMessage,setErrorMessage]=useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLogin(event){
    Axios.post("/login",{username:username,password:password}).then((res)=>{
      console.log(res);
      if(res.data.login==="success"){
        props.checkStatus();
      }else{
        setErrorMessage(res.data.error);
        setShowAlert(true);
      }
    }).catch((err)=>{
      setErrorMessage("Check if username or password is correct");
      setShowAlert(true);
    })
  
  }
  function handleRegister(event){
    Axios.post("/register",{username:username,password:password}).then((res)=>{
      if(res.data.register==="failed"){
        setErrorMessage(res.data.error);
        setShowAlert(true);
      }else{
        props.checkStatus();
      }
    })
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
      <Paper
        elevation={3}
        className="title"
        style={{ backgroundColor: "#9A86A4", color: "white" }}
      >
        Login
      </Paper>
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
          marginBottom:"25px"
        }}
      >
        <TextField
          style={{ marginBottom: "20px" }}
          className="username"
          label="Username"
          value={username}
          onChange={handleUsernameChange}
          variant="outlined"
        />
        <TextField
          style={{ marginBottom: "20px" }}
          className="password"
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          variant="outlined"
        />
        <div className="lorButtons">
        <Button className="lorButton" variant="contained" onClick={handleLogin}>
          Login
        </Button>
        <Button className="lorButton" variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </div>
      </Paper>
      {showAlert?<Alert severity="error">{errorMessage}</Alert>:null}
    </div>
  );
}
