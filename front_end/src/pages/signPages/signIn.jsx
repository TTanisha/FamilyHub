import React from 'react';
import axios from 'axios';
import './sign.css';
import { Button, Grid, Input, Spacer } from '@nextui-org/react';
  
const SignIn = () => {
  const[email, setEmail] = React.useState("");
  const[password, setPassword] = React.useState("");

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      signUserIn({email: email, password:password})
    }
  };
  
  localStorage.setItem("loggedIn", "false");

  return (
    <div className="sign-in">
      <h1>Family Hub</h1>
      <h2>Sign-In</h2>
      <form>
        <Grid.Container direction='column'>
        <Input 
          label="Email Address:"
          onChange={e => setEmail(e.target.value)}>
        </Input>
        <Spacer/>
        <Input 
          label="Password:"
          type="password"
          onKeyDown={handleKeyDown}
          onChange={p => setPassword(p.target.value)}>
        </Input>
        </Grid.Container>
      </form>
      <Button 
        className="sign-in" 
        type="submit"
        onClick={()=>signUserIn({email: email, password:password})}
      >
        Sign-In
      </Button>
      <div>Don't have an account? Sign-up below!</div>
      <Button 
        color="secondary"  
        onClick={()=>{window.location.href = '/sign-up'}}
      >
        Create an Account
      </Button>
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
  }).catch(function () {
    if(props.email == "" || props.password == "") {
      window.alert("Please enter your email and password.");
    } else {
      window.alert("Invalid credentials. Please try again.");
    }
  })).then((data)=>{
    if(data === undefined)
    {
      console.log("failed response")
    }
    else{
      window.location.href = '/calendar';
    }
   });
}

export default SignIn;