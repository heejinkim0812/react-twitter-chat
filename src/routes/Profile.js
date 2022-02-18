import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "fbase";

export default () => {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
