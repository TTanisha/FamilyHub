import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './sign.css';


const SignUp = () => {
    const[email, setEmail] = React.useState('');
    const[password, setPassword] = React.useState('');
    const[birthDate, SetBirthDate] = React.useState(new Date());
  return (
    <div class="sign-up">
        <h1>Sign-Up</h1>
      <label>
        Email Address: <input value={email} onChange={e => setEmail(e.target.value)}/>
    </label>
    <label>
        Password: <input value={password} onChange={p => setPassword(p.target.value)}/>
    </label>
    <DatePicker dateFormat="dd/MM/yyyy" selected={birthDate} onChange={(date)=> SetBirthDate(date)}/>
    {/* {email !== '' &&
        <p>Your name is {email}.</p>
      } */}
      <button class="sign-in">Sign-In</button>
    </div>
  );
};
  

export default SignUp;