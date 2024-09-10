import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Login.css";
export default function Login() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      let res = await axios.get("http://localhost:8800/auth/user", {
        withCredentials: true,
      });
      if (res.data.loggedIn) {
        navigate("/admin");
      } else {
        console.log("hafoahf");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogin = () => {
    const newWindow = window.open(
      "http://localhost:8800/auth/google",
      "_blank",
      "width=500,height=600"
    );

    const checkWindowClosed = setInterval(async () => {
      if (newWindow.closed) {
        clearInterval(checkWindowClosed);
        checkAuth();
      }
    }, 1000); // Check every second
  };
  const handleManualLogin = async () => {
    try {
      let res = await axios.get("http://localhost:8800/manuallogin", {
        params: { email: email, passwd: password },
        withCredentials: true,
      });
      checkAuth();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="App">
      <div className="Box">
        <h1 style={{ textAlign: "center" }}>Notes App Login</h1>
        {/* <br /> */}
        <p style={{ textAlign: "center" }}>
          Enter your email and password to access your notes
        </p>
        Email: <br />
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          style={{
            width: "100%",
            padding: "5px",
            margin: "5px",
            border: "none",
            borderRadius: "3px",
          }}
        />{" "}
        <br />
        Password: <br />
        <input
          type="password"
          name="password"
          id=""
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          style={{
            width: "100%",
            padding: "5px",
            margin: "5px",
            border: "none",
            borderRadius: "3px",
          }}
        />
        <br />
        <br />
        {authenticated ? (
          <p>User is authenticated</p>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <button
              onClick={handleManualLogin}
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "5px",
                width: "9vw",
                border: "none",
                height: "5vh",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              onClick={handleLogin}
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "5px",
                width: "9vw",
                border: "none",
                height: "5vh",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
