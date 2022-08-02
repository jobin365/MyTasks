import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import "./RegisterOrLogin.css";
import Button from "@mui/material/Button";
import Axios from "axios";
import Alert from "@mui/material/Alert";
import googleLogo from "./images/google.png";
import LoadingBar from "react-top-loading-bar";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLogin(event) {
    if (isValidEmail(username)) {
      props.load.current.continuousStart();
      Axios.post("/login", { username: username, password: password })
        .then((res) => {
          if (res.data.login === "success") {
            props.checkStatus();
          } else {
            setErrorMessage(res.data.error);
            setShowAlert(true);
          }
        })
        .catch((err) => {
          setErrorMessage("Check if username or password is correct");
          setShowAlert(true);
          props.load.current.complete();
        });
    } else {
      setErrorMessage("Invalid Email");
      setShowAlert(true);
    }
  }

  function handleRegister(event) {
    if (isValidEmail(username)) {
      props.load.current.continuousStart();
      Axios.post("/register", { username: username, password: password }).then(
        (res) => {
          if (res.data.register === "failed") {
            setErrorMessage(res.data.error);
            setShowAlert(true);
            props.load.current.complete();
          } else {
            props.checkStatus();
          }
        }
      );
    } else {
      setErrorMessage("Invalid Email");
      setShowAlert(true);
    }
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
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
          marginBottom: "25px",
        }}
      >
        <TextField
          style={{ marginBottom: "20px" }}
          className="username"
          label="Email"
          value={username}
          onChange={handleUsernameChange}
          variant="outlined"
          type="email"
        />
        <TextField
          style={{ marginBottom: "20px" }}
          className="password"
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          variant="outlined"
          type="password"
        />
        <div className="lorButtons">
          <Button
            className="lorButton"
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            className="lorButton"
            variant="contained"
            onClick={handleRegister}
          >
            Register
          </Button>
        </div>
        <a href="/auth/google" style={{ textDecoration: "none" }}>
          {/* <a href="http://localhost:3001/auth/google" style={{textDecoration:"none"}}> */}
          <Button
            variant="outlined"
            className="googleButton"
            style={{ marginTop: "20px" }}
          >
            <img
              style={{ width: "33px", height: "34px", marginRight: "10px" }}
              src={googleLogo}
            ></img>
            Login with Google
          </Button>
        </a>
      </Paper>
      {showAlert ? <Alert severity="error">{errorMessage}</Alert> : null}
    </div>
  );
}
