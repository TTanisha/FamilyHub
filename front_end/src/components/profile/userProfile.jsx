import React, { useEffect, useState } from 'react';
import "./userProfile.css";
import axios from 'axios';
import {Text, useModal, Button, Grid, Card, Spacer, Input} from "@nextui-org/react";


const UserProfile = (props) => {

  //form input
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [pronouns, setPronouns] = useState(null);
  const [address, setaddress] = useState(null);
  const [cellNumber, setCellNumber] = useState(null);
  const [homeNumber, setHomeNumber] = useState(null);

  // Logic variables
  const [clickable, setClickable] = useState({"pointerEvents": "none"});
  const [editing, setEditing] = useState(false);
  const [isLoggedUser, setIsLoggedUser] = useState(true);
  let currUser;
  

  // Get other member profile data given the ID.
  const GetMemberData = () => {
    axios.post("http://localhost:8080/api/users/getUserById", {id: props.userId})
    .then(function(response)
    {
        if(response.data.status === "success")
        {          
          currUser = response.data.data.user;
          setIsLoggedUser(false);
          setUserInfo(currUser);
        }
    }).catch(function (error) {
        console.log(error)
    })
  }

  
  const setUserInfo = (inputUser) => {
    let date = new Date(currUser.birthday);
    date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    date = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + (((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())));
    
    setEmail(inputUser.email);
    setFirstName(inputUser.firstName);
    setLastName(inputUser.lastName);
    setBirthday(date);
    setNickname(inputUser.nickname);
    setPronouns(inputUser.pronouns);
    setaddress(inputUser.address);
    setCellNumber(inputUser.cellNumber);
    setHomeNumber(inputUser.homeNumber);
  }
  

  //Update local storage: localStorage.setItem("user", JSON.stringify(newUser));
  const updateLocalStorage = (inputUser) => {
    inputUser.firstName = firstName;
    inputUser.lastName = lastName;
    inputUser.birthday = birthday;
    inputUser.nickname = nickname;
    inputUser.pronouns = pronouns;
    inputUser.address = address;
    inputUser.cellNumber = cellNumber;
    inputUser.homeNumber = homeNumber;
    // update
    localStorage.setItem("user", JSON.stringify(inputUser));
  }

  const restoreValue = (inputUser) => {

    console.log(inputUser.firstName);
    setFirstName(inputUser.firstName);
    setLastName(inputUser.lastName);
    setBirthday(inputUser.birthday);
    setNickname(inputUser.nickname);
    setPronouns(inputUser.pronouns);
    setaddress(inputUser.firstName);
    setCellNumber(inputUser.cellNumber);
    setHomeNumber(inputUser.homeNumber);
    window.location.reload(false);
}

  const submitUpdateUser = (props) => {
    axios.post("http://localhost:8080/api/users/updateUser", 
    { 
      email : email,
      firstName: firstName, 
      lastName: lastName, 
      birthday: new Date (birthday), 
      nickname: nickname, 
      pronouns: pronouns, 
      address: address, 
      cellNumber: cellNumber, 
      homeNumber: homeNumber
    })
      .then(function(response)
      {
          if(response.data.status === "success")
          {
            console.log(response);
            updateLocalStorage(JSON.parse(localStorage.getItem("user")));
            setEditing(false);
            setClickable({"pointerEvents": "none"});
          }
      }).catch(function (error) {
        console.log("Error in User Profile");
        console.log(error);

      })
  }

  useEffect(()=>{
    if (props.currUser == false) {
      GetMemberData();
    } else {
      currUser = JSON.parse(localStorage.getItem("user"));
      setIsLoggedUser(true);
      setUserInfo(currUser);
    }}, [])
  


  return (
    <div>
      <Card css={{ $$cardColor: '$colors$gradient' }}> 
      { isLoggedUser &&
          <Text h3 color="#ffffff"> My Profile</Text> 
      }
      { !isLoggedUser &&
          <Text h3 color="#ffffff"> Family Member Profile</Text> 
      }
      </Card>
      <div className='inputWrapper' style={clickable}>
      <Spacer y={2}/>
      <Input 
          size="xl" 
          aria-label="Email"
          labelLeft="Email"
          initialValue={email} 
          readOnly/>
        <Spacer y={1}/>
        <Input 
          size="xl"
          aria-label="First Name"
          labelLeft="First Name"
          initialValue={firstName} 
          onChange={e => setFirstName(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          size="xl"
          aria-label='Last Name'
          labelLeft="Last Name"
          initialValue={lastName} 
          onChange={e => setLastName(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          size="xl"
          aria-label="Birthday"
          labelLeft='Birthday' 
          type={"date"}
          initialValue={birthday} 
          onChange={e => setBirthday(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          size="xl"
          aria-label="Nickname"
          labelLeft='Nickname'  
          initialValue={nickname} 
          onChange={e => setNickname(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          size="xl"
          aria-label="Pronouns"
          labelLeft='Pronouns' 
          initialValue={pronouns} 
          onChange={e => setPronouns(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          size="xl"
          aria-label="Address"
          labelLeft='Address' 
          initialValue={address} 
          onChange={e => setaddress(e.target.value)}/>
        <Spacer y={1}/>
        <Input 
          size="xl"
          aria-label="Cell Number"
          labelLeft='Cell Number' 
          initialValue={cellNumber} 
          onChange={e => setCellNumber(e.target.value)}/>
        <Spacer y={1}/>
        <Input
          size="xl"
          aria-label='Home Number' 
          labelLeft='Home Number' 
          initialValue={homeNumber} 
          onChange={e => setHomeNumber(e.target.value)}/>
        <Spacer y={1}/>
      </div>
      <div>
      { isLoggedUser &&
        <Grid.Container gap={2} justify="center" direction = 'row'>
          { !editing &&
            <Grid>
              <Button auto  size="lg" onPress={() => {setEditing(true); setClickable({"pointerEvents": "auto"})}}>Edit</Button>
            </Grid>
          }  
          { editing &&
            <Grid xs={3}  >
              <Button  flat auto size="lg" color="error" onPress={() => {setEditing(false); setClickable({"pointerEvents": "none"}); restoreValue(JSON.parse(localStorage.getItem("user"))); }}> Discard changes</Button>
              <Button auto size="lg" onPress={() => { submitUpdateUser(props)}}>Update</Button>
            </Grid>
          }
        </Grid.Container>
      }
      </div>
    </div>
  );
};

export default UserProfile;