import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
import SearchBar from "./SearchBar";
import "./NavBar.css";

const NavBar = () => {
  const sessionUser = useSelector(state => state.session.user);
  const userId = sessionUser?.id;
  let userVals = [];
  if (sessionUser) {
    userVals = Object.values(sessionUser);
  }

  return (
    <nav className="light_gray">
      <div className="container_row nav_left">
        <h1>
          <NavLink to="/" exact={true} activeClassName="active">
            Quote Typing
          </NavLink>
        </h1>
        {userVals.length > 0 && <SearchBar />}
      </div>
      <ul className="container_row">
        <li>
          <NavLink to="/" exact={true} activeClassName="active">
            Home
          </NavLink>
        </li>
        {userVals.length > 0 ? (
          <>
            <li>
              <NavLink
                to={`/users/${userId}`}
                exact={true}
                activeClassName="active"
              >
                Profile Page
              </NavLink>
            </li>
            <li>
              <LogoutButton />
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" exact={true} activeClassName="active">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/sign-up" exact={true} activeClassName="active">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
