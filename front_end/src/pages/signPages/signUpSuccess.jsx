import React from 'react';
import './sign.css';
  
const SignInSuccess = () => {
  return (
    <div class="sign-in">
        <h1>Family Hub</h1>
        <h2>Your account has been successfully created.</h2>
        <h3>Please return to the login page.</h3>
      <button class="sign-in" onClick={()=>{window.location.href = '/'}}>Return to login</button>
    </div>
  );
};


export default SignInSuccess;