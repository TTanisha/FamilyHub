import React from "react";
import "./sign.css";
import * as Constants from "../../constants";

const SignOut = () => {
  localStorage.setItem(Constants.LOGGED_IN, false);

  return <div class="sign-in">{(window.location.href = "/")}</div>;
};

export default SignOut;
