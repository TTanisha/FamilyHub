import React, {useEffect, useState} from 'react';
import UserProfile from '../../components/profile/userProfile';
import './profile.css';
import axios from 'axios';
import { Collapse, Text, Card } from "@nextui-org/react";
import { useSearchParams } from 'react-router-dom';
  
const FamilyMemberProfile = () => {
  const [loading, setLoading] = useState(true);
  const [searchparams] = useSearchParams();
  const [userId] = useState(searchparams.get("id"));

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
          <UserProfile currUser={false} userId={userId}/>
        </div>
      </div>
    );
  };
    
  export default FamilyMemberProfile;