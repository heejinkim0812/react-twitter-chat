import React from "react";
import {
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import AuthForm from "components/AuthForm";
import { authService } from "fbase";

const Auth = () => {
  //
  //========= SOCIAL JOIN ==========
  //
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider);
  };

  //
  //=========== RETURN =============
  //
  return (
    <div>
      <AuthForm />
      <button onClick={onSocialClick} name="google">
        Continue with Google
      </button>
      <button onClick={onSocialClick} name="github">
        Continue with Github
      </button>
    </div>
  );
};

export default Auth;
