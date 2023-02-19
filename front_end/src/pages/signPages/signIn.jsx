import React from 'react';
import axios from 'axios';
import './sign.css';

const test = {
email: "email@address.com",
password: "password123",
firstName: "YourOwn",
lastName: "Name",
birthday: new Date(),
};
  
const SignIn = () => {
    const[email, setEmail] = React.useState('');
    const[password, setPassword] = React.useState('');
  
  localStorage.setItem("loggedIn", "false");

  return (
    <div className="sign-in">
        <h1>Family Hub</h1>
        <h2>Sign-In</h2>
      <label>
        Email Address: <input value={email} onChange={e => setEmail(e.target.value)}/>
    </label>
    <label>
        Password: <input type="password" value={password} onChange={p => setPassword(p.target.value)}/>
    </label>
      <button className="sign-in" onClick={()=>signUserIn({email: email, password:password})}>Sign-In</button>
      <div>Don't have an account? Sign-up below!</div>
      <button className="sign-in" onClick={()=>{window.location.href = '/sign-up'}}>Sign-Up</button>
    </div>
  );
};

async function signUserIn(props) {

  let res = Promise.resolve(
  await axios.post("http://localhost:8080/api/users/getUser", props)
  .then(function(response)
  {
      console.log(response);
      if(response.data.status === "success")
      {
        const newUser = response.data.data.user;
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("loggedIn", "true");
        return response.data;
      }
  }).catch(function (error) {
  })
  ).then((data)=>{
    if(data === undefined)
    {
      console.log("failed response")
    }
    else{
      console.log(data)
      window.location.href = '/calendar';
    }
   });

  console.log(res);
}

export default SignIn;