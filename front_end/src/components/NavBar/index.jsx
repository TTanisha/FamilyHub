import React from "react";
import { Nav, NavLink, NavMenu } 
    from "../../components/NavBar/navbarElements"; //Need to define path relative to ./src
  
const Navbar = () => {
  return ( 
    <>
      <Nav>
        <NavMenu>
        <NavLink to="/">
            Home
          </NavLink>
          <NavLink to="/calendar">
            Calendar
          </NavLink>
          <NavLink to="/familygroups">
            My Family Groups
          </NavLink>
          <NavLink to="/sign-up">
            Sign Up
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;