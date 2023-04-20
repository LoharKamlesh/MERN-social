import axios from "axios";
import React, { useRef } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const navigate = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault();
    if (confirmPassword.current.value !== password.current.value) {
      password.current.setCustomValidity("Passwords dint match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        confirmPassword: confirmPassword.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">ByloSocial</h3>
          <span className="loginDesc">
            Connect with friends and world around you using ByloSocial
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              ref={username}
              required
              className="loginInput"
            />
            <input
              placeholder="Email"
              ref={email}
              required
              type="email"
              className="loginInput"
            />
            <input
              placeholder="Password"
              ref={password}
              type="password"
              minLength="6"
              required
              className="loginInput"
            />
            <input
              placeholder="Confirm Password"
              ref={confirmPassword}
              type="password"
              required
              className="loginInput"
            />
            <button className="loginButton" type="submit">
              Sign up
            </button>
            <button className="loginRegisterButton" onClick={handleLoginClick}>
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
