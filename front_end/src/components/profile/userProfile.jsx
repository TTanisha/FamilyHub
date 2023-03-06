import React, { useEffect, useState } from 'react';
import "./userProfile.css";
import axios from 'axios';
import {Text, useModal, Button, Grid, Card, Spacer, Input} from "@nextui-org/react";


const UserProfile = (props) => {
  let currUser = JSON.parse(localStorage.getItem("user"));

  //form input
  const [newEmail, setNewEmail] = useState(currUser.email);
  const [firstName, setFirstName] = useState(currUser.firstName);
  const [lastName, setLastName] = useState(currUser.lastName);
  const [birthday, setBirthday] = useState(currUser.birthday);
  const [nickname, setNickname] = useState(currUser.nickname); 
  const [pronouns, setPronouns] = useState(currUser.pronouns); 
  const [displayEmail, setDisplayEmail] = useState(currUser.email);
  const [address, setaddress] = useState(currUser.address); 
  const [cellNumber, setCellNumber] = useState(currUser.cellNumber); 
  const [homeNumber, setHomeNumber] = useState(currUser.homeNumber);

  // Logic variables
  const [clickable, setClickable] = useState({"pointerEvents": "none"});
  const [editing, setEditing] = useState(false);

  //Need to update local storage: localStorage.setItem("user", JSON.stringify(newUser));

  async function submitEditUserInfo() {
    var data = { "email" : newEmail, 
                  "firstName": firstName, 
                  "lastName": lastName, 
                  "birthday": birthday, 
                  "nickname": nickname, 
                  "pronouns": pronouns, 
                  "displayEmail": displayEmail, 
                  "address": address, 
                  "cellNumber": cellNumber, 
                  "homeNumber": homeNumber
                }
    console.log(data);
    /*
    axios.post("http://localhost:8080/api/users/updateUser", 
      { "email" : newEmail, 
        "firstName": firstName, 
        "lastName": lastName, 
        "birthday": birthday, 
        "nickname": nickname, 
        "pronouns": pronouns, 
        "displayEmail": displayEmail, 
        "address": address, 
        "cellNumber": cellNumber, 
        "homeNumber": homeNumber
      })
      .then(function(response)
      {
          if(response.data.status === "success")
          {
            console.log(response);

          }
      }).catch(function (error) {
        console.log("Error in User Profile");
      })
      */
  }
  return (
    <div>
      <div className='inputWrapper' style={clickable}>
      `<Input 
          aria-label="Email"
          labelLeft="Email"
          initialValue={newEmail} 
          onChange={e => setNewEmail(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          aria-label="First Name"
          labelLeft="First Name"
          initialValue={firstName} 
          onChange={e => setFirstName(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          aria-label='Last Name'
          labelLeft="Last Name"
          initialValue={lastName} 
          onChange={e => setLastName(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          aria-label="Birthday"
          labelLeft='Birthday' 
          type='date' 
          initialValue={birthday} 
          onChange={e => setBirthday(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          aria-label="Nickname"
          labelLeft='Nickname'  
          initialValue={nickname} 
          onChange={e => setNickname(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          aria-label="Pronouns"
          labelLeft='Pronouns' 
          initialValue={pronouns} 
          onChange={e => setPronouns(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          aria-label="Display Email"
          labelLeft='Display Email' 
          initialValue={displayEmail} 
          onChange={e => setDisplayEmail(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          aria-label="Address"
          labelLeft='Address' 
          initialValue={address} 
          onChange={e => setaddress(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          aria-label="Cell Number"
          labelLeft='Cell Number' 
          initialValue={cellNumber} 
          onChange={e => setCellNumber(e.target.value)}/>
        <Spacer y={1}/>
        <Input
          aria-label='Home Number' 
          labelLeft='Home Number' 
          initialValue={homeNumber} 
          onChange={e => setHomeNumber(e.target.value)}/>
        <Spacer y={1}/>
      </div>
      <div>
      <Grid.Container gap={2} justify="center" direction = 'row'>
        { !editing &&
          <Grid>
            <Button onPress={() => {setEditing(true); setClickable({"pointerEvents": "auto"})}}>Edit</Button>
          </Grid>
        }  
        { editing &&
          <Grid xs={3}  >
            <Button flat auto color="error" onPress={() => {setEditing(false); setClickable({"pointerEvents": "none"}) }}> Discard changes</Button>
            <Button onPress={() => {submitEditUserInfo(props)}}>Update</Button>
          </Grid>
        }
      </Grid.Container>

      </div>
    </div>

      
  );
};

export default UserProfile;