import React, {useEffect, useState} from 'react';
import UserProfile from '../../components/profile/userProfile';
import './profile.css';
import axios from 'axios';
import { Collapse, Text, Card } from "@nextui-org/react";
  


const Profile = () => {
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      if(0 != 0) {
        setLoading(true);
        
      } else {
        setLoading(false);
      }
  }, []);
  
    return (
      <div className="familyGroupContainer">
        <div className="content">
          <UserProfile currUser={true} />
        </div>
      </div>
    );
  };
    
  export default Profile;