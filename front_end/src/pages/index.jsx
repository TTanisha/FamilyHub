import React from 'react';
  
const Home = (props) => {
  
  props.funcNav(true);
  return (
    <div>
      <h1>Welcome to FamilyHub</h1>
    </div>
  );
};
  
export default Home;