import React, { useState } from 'react';
import UserProfile from '../../components/profile/userProfile';
import './profile.css';
import { useSearchParams } from 'react-router-dom';
  
const FamilyMemberProfile = () => {
  const [searchparams] = useSearchParams();
  const [userId] = useState(searchparams.get("id"));

  return (
    <div className="familyGroupContainer">
      <div className="content">
        <UserProfile currUser={false} userId={userId}/>
      </div>
    </div>
  );
  };
    
  export default FamilyMemberProfile;