import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './pages/calendar';
import FamilyGroups from './pages/familyGroups/familyGroups';
import SignIn from './pages/signPages/signIn';
import SignOut from './pages/signPages/signOut';
import { Navigate } from 'react-router-dom';
import SignUp from './pages/signPages/signUp';
import SignUpSuccess from './pages/signPages/signUpSuccess';
import { NextUIProvider, Navbar, Text, Avatar, Dropdown } from "@nextui-org/react";

function App() {

  let isLoggedIn = (localStorage.getItem("loggedIn") === "true");


  return (
    <NextUIProvider>
      <Navbar isBordered maxWidth={"fluid"} variant={"floating"} >
        <Navbar.Content enableCursorHighlight>
          <Navbar.Brand>
            <Text b color="inherit" hideIn="xs">
              FamilyHub
            </Text>
          </Navbar.Brand>
          {isLoggedIn ? null : 
          <Navbar.Link href="/" isActive={window.location.pathname ==="/"}>
              Login </Navbar.Link>}
          {!isLoggedIn ? null : 
            <Navbar.Link href="/calendar"  isActive={window.location.pathname ==="/calendar"} >            
            Calendar </Navbar.Link>}
          {!isLoggedIn ? null : <Navbar.Link href="/familygroups" isActive={window.location.pathname ==="/familygroups"} >            
            Family Groups</Navbar.Link>}
          {isLoggedIn ? null : <Navbar.Link href="/sign-up" isActive={window.location.pathname ==="/sign-up"}>            
            Sign up</Navbar.Link>}
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
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  />
                </Dropdown.Trigger>
              </Navbar.Item>
              <Dropdown.Menu
                aria-label="User menu actions"
                color="secondary"
                onAction={(actionKey) => console.log({ actionKey })}
              >
                <Dropdown.Item key="profile" css={{ height: "$18" }}>
                  <Text b color="inherit" css={{ d: "flex" }}>
                    Signed in as
                  </Text>
                  <Text b color="inherit" css={{ d: "flex" }}>
                    zoey@example.com
                  </Text>
                </Dropdown.Item>
                <Dropdown.Item key="viewProfile" withDivider>
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item key="logout" withDivider color="error">
                  <Navbar.Link href="/signout">Log Out</Navbar.Link>
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
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/signup-success' element={<SignUpSuccess />} />
        </Routes>
      </Router>
    </NextUIProvider>
  );
}

export default App;