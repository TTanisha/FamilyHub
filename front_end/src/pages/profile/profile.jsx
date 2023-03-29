import React from 'react';
import UserProfile from '../../components/profile/userProfile';
import './profile.css';

const Profile = () => {
    return (
      <div className="familyGroupContainer">
        <div className="content">
          <UserProfile currUser={true} />
        </div>
      </div>
    );
  };
    
  export default Profile;