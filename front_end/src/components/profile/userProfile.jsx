import React, { useEffect, useState } from 'react';
import "./userProfile.css";
import axios from 'axios';
import {Text, useModal, Button, Card, Spacer, Input} from "@nextui-org/react";


const UserProfile = (props) => {
  let currUser = JSON.parse(localStorage.getItem("user"));

  //form input
  const [firstName, setFirstName] = useState(currUser.firstName);
  const [lastName, setLastName] = useState(currUser.lastName);
  const [birthday, setBirthday] = useState(currUser.birthday);
  const [nickname, setNickname] = useState(""); 
  const [pronouns, setPronouns] = useState(""); 
  const [displayEmail, setDisplayEmail] = useState(currUser.email);
  const [address, setaddress] = useState(""); 
  const [cellNumber, setCellNumber] = useState(""); 
  const [homeNumber, setHomeNumber] = useState("");


    useEffect(() => {
        //console.log(firstName);
    }, [])

    /*
    const updateUserInfo = (props) => {
      axios.post("http://localhost:8080/api/users/updateUser", 
      {
        
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
    }
*/
    return (
        <div>
          <Input 
            aria-label="First Name"
            
            label="First Name"
            initialValue={firstName} 
            onChange={e => setFirstName(e.target.value)}/>
          <Input 
            aria-label='Last Name'
            readOnly
            label="Last Name"
            initialValue={lastName} 
            onChange={e => setLastName(e.target.value)}/>
          <Input 
            aria-label="Birthday"
            readOnly 
            label='Birthday' 
            type='date' 
            initialValue={birthday} 
            onChange={e => setBirthday(e.target.value)}/>
          <Input 
            aria-label="Nickname"
            readOnly 
            label='Nickname'  
            initialValue={nickname} 
            onChange={e => setNickname(e.target.value)}/>
          <Input 
            aria-label="Pronouns"
            readOnly 
            label='Pronouns' 
            initialValue={pronouns} 
            onChange={e => setPronouns(e.target.value)}/>
          <Input 
            aria-label="Display Email"
            readOnly
            label='Display Email' 
            initialValue={displayEmail} 
            onChange={e => setDisplayEmail(e.target.value)}/>
          <Input 
            aria-label="Address"
            readOnly
            label='Address' 
            initialValue={address} 
            onChange={e => setaddress(e.target.value)}/>
          <Input 
            aria-label="Cell Number"
            readOnly
            label='Cell Number' 
            initialValue={cellNumber} 
            onChange={e => setCellNumber(e.target.value)}/>
          <Input
            aria-label='Home Number' 
            readOnly 
            label='Home Number' 
            initialValue={homeNumber} 
            onChange={e => setHomeNumber(e.target.value)}/>
          <Button flat auto color="error" onPress={() => setVisible(false)}> Discard changes</Button>
          <Button onPress={() => {updateUserInfo(props)}}>Update</Button>

        </div>
    );
};

export default UserProfile;