import React from 'react';
import './sign.css';
  
const SignIn = () => {
    const[email, setEmail] = React.useState('');
    const[password, setPassword] = React.useState('');
  return (
    <div class="sign-in">
        <h1>Sign-In</h1>
      <label>
        Email Address: <input value={email} onChange={e => setEmail(e.target.value)}/>
    </label>
    <label>
        Password: <input value={password} onChange={p => setPassword(p.target.value)}/>
    </label>
    {/* {email !== '' &&
        <p>Your name is {email}.</p>
      } */}
      <button class="sign-in">Sign-In</button>
    </div>
  );
};
  

export default SignIn;