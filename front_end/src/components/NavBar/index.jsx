import React from "react";
import { Nav, NavLink, NavMenu } 
    from "../../components/NavBar/navbarElements"; //Need to define path relative to ./src
  
const Navbar = () => {

  let isLoggedIn = (localStorage.getItem("loggedIn") === "true");

  return ( 
    <>
      <Nav>
        <NavMenu>
          {!isLoggedIn && 
            <NavLink to="/">
            Sign-in
          </NavLink>
          }
          {isLoggedIn && 
          <NavLink to="/calendar">
            Calendar
          </NavLink>
          }
          {isLoggedIn && 
          <NavLink to="/familygroups">
            My Family Groups
          </NavLink>
          }
          {isLoggedIn &&
            <NavLink to="/signout">
            Sign-Out
            </NavLink> }
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;