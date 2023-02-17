import React from "react";
import { Nav, NavLink, NavMenu } 
    from "../../components/NavBar/navbarElements"; //Need to define path relative to ./src
  
const Navbar = () => {

  if (window.location.pathname==='/')
  {
    return (
      <></>
    )
  }
  else if(window.location.pathname==='/sign-up' || window.location.pathname==='/signup-success')
  {
    return (
      <>
      <Nav>
        <NavMenu>
      <NavLink to="/">
      Sign-in
      </NavLink>
      </NavMenu>
      </Nav>
    </>
    )
  }

  return ( 
    <>
      <Nav>
        <NavMenu>
        {/* <NavLink to='/'>
            Sign-Out
          </NavLink> */}
          <NavLink to="/calendar">
            Calendar
          </NavLink>
          <NavLink to="/familygroups">
            My Family Groups
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;