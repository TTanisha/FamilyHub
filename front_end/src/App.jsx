import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './pages/calendar/calendar';
import FamilyGroups from './pages/familyGroups/familyGroups';
import SignIn from './pages/signPages/signIn';
import SignOut from './pages/signPages/signOut';
import Profile from './pages/profile/profile';
import FamilyMemberProfile from './pages/profile/familyMemberProfile';
import { Navigate } from 'react-router-dom';
import SignUp from './pages/signPages/signUp';
import { NextUIProvider, Navbar, Text, Avatar, Dropdown, Button } from "@nextui-org/react";
import profilePicture from './images/user.png';

function App() {

  let isLoggedIn = (localStorage.getItem("loggedIn") === "true");
  let currUser = JSON.parse(localStorage.getItem("user"));

  return (
    <NextUIProvider>
      <Navbar css={{backgroundColor: "#0b16e0"}}isBordered maxWidth={"fluid"} variant={"sticky"} >

        <Navbar.Content enableCursorHighlight>
          <Navbar.Brand>
            <Text b color="inherit" hideIn="xs"> FamilyHub </Text>
          </Navbar.Brand>
          {isLoggedIn ? null :
            <Navbar.Link href="/" isActive={window.location.pathname === "/"}> Login </Navbar.Link>}
          {!isLoggedIn ? null :
            <Navbar.Link href="/calendar" isActive={window.location.pathname === "/calendar"}> Calendar </Navbar.Link>}
          {!isLoggedIn ? null : <Navbar.Link href="/familygroups" isActive={window.location.pathname === "/familygroups"}> Family Groups </Navbar.Link>}
          {isLoggedIn ? null : <Navbar.Link href="/sign-up" isActive={window.location.pathname === "/sign-up"}> Sign up </Navbar.Link>}
        </Navbar.Content>

        {/* profile */}
        {!isLoggedIn ? null :
          <Navbar.Content
            css={{
              "@xs": {
                w: "12%",
                jc: "flex-end",
              },
            }}
          >
            <Dropdown placement="bottom-right">
              <Navbar.Item>
                <Dropdown.Trigger>
                  <Avatar
                    bordered
                    as="button"
                    color="secondary"
                    size="md"
                    src={profilePicture}
                  />
                </Dropdown.Trigger>
              </Navbar.Item>
              <Dropdown.Menu
                aria-label="User menu actions"
                color="secondary"
                
              >
                <Dropdown.Item as={Text} variant="light" autokey="viewProfile" withDivider textValue css={{height: "$17", width:"$60"}}> 
                <Button flat light css={{height: "$18", justifyContent: "flex-start"}} > 
                    Signed in as {currUser.email}
                  </Button> 
                </Dropdown.Item>
                <Dropdown.Item as={Text} variant="light" autokey="viewProfile" withDivider textValue css={{height: "$18", width: "$60" }}> 
                  <Button as={Navbar.Link} flat light href="/profile" isActive={window.location.pathname === "/profile"} css={{height: "$18", justifyContent: "flex-start"}} > 
                    My Profile 
                  </Button> 
                </Dropdown.Item>
                <Dropdown.Item as={Text} variant="light" autokey="viewProfile" withDivider textValue css={{height: "$18", width: "$60" }}> 
                  <Button as={Navbar.Link} color="error" flat href="/signout" isActive={window.location.pathname === "/signout"}  css={{height: "$18", justifyContent: "flex-start"}} > 
                    Log Out 
                  </Button>
                </Dropdown.Item>
                
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Content>
        }
      </Navbar>

      <Router>
        <Routes>
          <Route exact path='/' element={isLoggedIn ? <Calendar /> : <SignIn />} />
          <Route path='/calendar' element={isLoggedIn ? <Calendar /> : <Navigate to='/' />} />
          <Route path='/familygroups' element={isLoggedIn ? <FamilyGroups /> : <Navigate to='/' />} />
          <Route path='/signout' element={isLoggedIn ? <SignOut /> : <Navigate to='/' />} />
          <Route path='/profile' element={isLoggedIn ? <Profile /> : <Navigate to='/' />} />
          <Route path='/familymemberprofile' element={isLoggedIn ? <FamilyMemberProfile /> : <Navigate to='/' />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
      </Router>
    </NextUIProvider>
  );
}

export default App;