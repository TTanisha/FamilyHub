import React from 'react';
import './sign.css';

const SignOut = () => {
  localStorage.setItem("loggedIn", "false");

  return (
    <div class="sign-in">
     {window.location.href='/'}
    </div>
  );
};

export default SignOut;