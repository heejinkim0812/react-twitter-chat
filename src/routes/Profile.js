import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "@firebase/auth";
import { authService } from "fbase";

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  //
  //================ LOGOUT ================
  //

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  //
  //============= UPDATE PROFILE =============
  //

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  //
  //================= RETURN =================
  //
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName || ""}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
