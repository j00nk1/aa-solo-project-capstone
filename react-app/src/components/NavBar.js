import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
import SearchBar from "./SearchBar";
import "./NavBar.css";
import icon from "./favicon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

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
            <img src={icon} alt="icon" className="icon" />
          </NavLink>
        </h1>
        {userVals.length > 0 && <SearchBar />}
      </div>
      <ul className="nav_center container_row">
        <li>
          <a
            href="https://www.linkedin.com/in/junki-sato-7bb773208/"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </li>
        <li>
          <a href="https://github.com/j00nk1" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </li>
      </ul>
      <ul className="container_row">
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
