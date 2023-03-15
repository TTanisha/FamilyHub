import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './sign.css';
import axios from 'axios';
import {Button, Grid, Input, Spacer} from "@nextui-org/react";

const SignUp = () => {
  const[firstName, setFirstName] = React.useState('');
  const[lastName, setlastName] = React.useState('');
  const[email, setEmail] = React.useState('');
  const[password, setPassword] = React.useState('');
  const[birthDate, setBirthDate] = React.useState(null);

  return (
    <div className="sign-up">
        <h1>Sign-Up</h1>
        <form>
          <Grid.Container direction='column' gap={3} alignContent="left">
            <Grid> 
              <Input 
                label="First Name:"
                helperText="required"
                onChange={fn => setFirstName(fn.target.value)}>
              </Input>
            </Grid>
            <Grid>
              <Input 
                label="Last Name:"
                helperText="required"
                onChange={ln => setlastName(ln.target.value)}>
              </Input>
            </Grid>
            <Grid>
              <Input 
                label="Email Address:"
                helperText="required"
                onChange={e => setEmail(e.target.value)}>
              </Input>
            </Grid>
            <Grid>
              <Input 
                label="Password:"
                helperText="required, must be at least 6 characters"
                type="password"
                onChange={p => setPassword(p.target.value)}>
              </Input>
            </Grid>
            <Grid>
              <Input 
                label="Birthday:"
                helperText="required"
                type="date"
                onChange={(date) => setBirthDate((new Date(date.target.value)).toISOString())}>
              </Input>
            </Grid>
          </Grid.Container>
        </form>
        <Spacer y={2}/>
        <Button 
          className="sign-in" 
          onClick={() => signUserUp({firstName: firstName, lastName: lastName, email: email, password:password, birthday: birthDate})}
        >
          Create account
        </Button>
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
       } 
   }).catch(function (error) {
       console.log(error);
       window.alert(error.response.data.message);
   })};
  
export default SignUp;