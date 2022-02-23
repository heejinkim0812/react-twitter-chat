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
    const ok = window.confirm(`Are you sure to logout?`);
    if (ok) {
      authService.signOut();
      navigate("/");
    }
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
      const ok = window.confirm(`Nickname Changed!`);
    }
  };

  //
  //================= RETURN =================
  //
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName || ""}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: "10px",
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
