import React from "react";
import { useLocation } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  const { pathname } = useLocation();

  const isLogin = pathname === "/login";

  return (
    <div className="welcome_container container_col">
      <h1>
        Welcome {isLogin ? "Back" : null} To{" "}
        <span className="dur welcome_message">Quote Typing</span>!
      </h1>
      <p>Check your typing skills with famous quotes!!</p>
    </div>
  );
}

export default Welcome;
