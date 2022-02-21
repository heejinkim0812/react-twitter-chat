import React from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "@firebase/auth";
import { authService, dbService } from "fbase";

const Navigation = ({ userObj }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName}의 Profile</Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
