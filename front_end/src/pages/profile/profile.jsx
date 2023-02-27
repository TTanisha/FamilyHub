import React, {useEffect, useState} from 'react';
import UserProfile from '../../components/profile/userProfile';
import './profile.css';
import axios from 'axios';
import { Collapse, Text, Card } from "@nextui-org/react";
  


const Profile = () => {
    const [familyGroups, setFamilyGroups] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const familyGroupArray = currentUser.groups;
  
    useEffect(() => {
      setFamilyGroups(familyGroupArray);
    }, []);
  
    useEffect(() => {
      if(familyGroups.length != 0) {
        setLoading(true);
        Promise.all(familyGroups.map(async (familyGroupId) => (
        //retrieve group objects using ID 
        await axios.post("http://localhost:8080/api/familyGroups/getFamilyGroup", {groupId: familyGroupId})
        .then(function(response)
        {
            if(response.data.status === "success")
            {       
              setData(prev => [...prev, response.data.data]);
            }
        })
        .catch(function (error) {
          if(error.message!='canceled') {
            console.log(error)
          }})
        .finally(() => setLoading(false))
      )))
      } else {
        setLoading(false);
      }
  }, [familyGroups]);
  
    return (
      <div className="familyGroupContainer">
        <div className="content">
          <Card css={{ $$cardColor: '$colors$gradient' }}> 
            <Text h3 color="#ffffff"> My Profile </Text> 
          </Card>
  
          <Collapse.Group splitted accordion={false}>
            { !loading && (
              (data.length != 0) ? data.map(
                (groupData) => (
                <Collapse key={groupData.group?._id} title={groupData.group?.groupName}> 
                  <UserProfile key={groupData.group?._id} groupId={groupData.group?._id} groupName={groupData.group?.groupName} groupMembers={groupData.group?.groupMembers}/>
                </Collapse>)
              ) : <Text> You are not part of any family groups  </Text>)
            }
          </Collapse.Group>
        </div>
      </div>
    );
  };
    
  export default Profile;