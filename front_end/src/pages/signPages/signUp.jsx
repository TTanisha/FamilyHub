import React from 'react';
import DatePicker from 'tui-date-picker'; 
import './sign.css';
  
const SignUp = () => {
    const[email, setEmail] = React.useState('');
    const[password, setPassword] = React.useState('');
  return (
    <div class="sign-up">
        <h1>Sign-Up</h1>
      <label>
        Email Address: <input value={email} onChange={e => setEmail(e.target.value)}/>
    </label>
    <label>
        Password: <input value={password} onChange={p => setPassword(p.target.value)}/>
    </label>
    <label>
      <div class="code-hmtml">
        <div class="tui-datepicker-input tui-datetime-input tui-has-focus">
          <input type="text" id="datepicker-input" aria-label="Date-Time"></input>
            <span class="tui-ico-date"></span>
        </div>
      </div>
    </label>
    {/* {email !== '' &&
        <p>Your name is {email}.</p>
      } */}
      <button class="sign-in">Sign-In</button>
    </div>
  );
};
  

export default SignUp;