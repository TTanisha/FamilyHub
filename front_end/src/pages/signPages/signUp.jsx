import React, { useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './sign.css';
import axios from 'axios';

const SignUp = () => {
  const[firstName, setFirstName] = React.useState('');
  const[lastName, setlastName] = React.useState('');
  const[email, setEmail] = React.useState('');
  const[password, setPassword] = React.useState('');
  const[birthDate, SetBirthDate] = React.useState(new Date());
  // const[signedUp, setSignedUp] = React.useState(false);
  // const[hasError, setHasError] = React.useState(false);
  // const[errorMessage, setErrorMessage] = React.useState("");

  return (
    <div className="sign-up">
        <h1>Sign-Up</h1>
        <label>
        First Name: <input value={firstName} onChange={fn => setFirstName(fn.target.value)}/>
    </label>
    <label>
        Last Name: <input value={lastName} onChange={ln => setlastName(ln.target.value)}/>
    </label>
      <label>
        Email Address: <input value={email} onChange={e => setEmail(e.target.value)}/>
    </label>
    <label>
        Password: <input type="password" value={password} onChange={p => setPassword(p.target.value)}/>
    </label>
    <label>Birthday (dd/mm/yyyy): </label>
    <DatePicker dateFormat="dd/MM/yyyy" selected={birthDate} onChange={(date)=> SetBirthDate(date)}/>
      <button className="sign-in" onClick={() => signUserUp({firstName: firstName, lastName: lastName, email: email, password:password, birthday: birthDate})}>Sign-Up</button>
      {/* <div> {hasError && <div>{errorMessage} </div> } </div>
   
    
    <div> {signedUp && <div>You've successfully created a new account! Return to the login page. 
          <button className="sign-in" onClick={() => {window.location.href = '/'}}>Return to login page</button></div> } </div> */}
    </div>
  );
};


async function signUserUp(props) {
  await axios.post("http://localhost:8080/api/users/registerUser", (props))
   .then(function(response)
   {
       if(response.data.status === "success")
       {
        window.location.href = '/signup-success';
        //  setSignedUp(true);
       } else {
        window.alert('Invalid details. Please try again.');
         //console.log(response.data.message);
        //  setHasError(true);
        //  setErrorMessage(response.data.message);
       }
   }).catch(function (error) {
       console.log(error);
       window.alert('Could not create account. Please try again.');
      //  setHasError(true);
      //  setErrorMessage(error);
   })};
  

export default SignUp;