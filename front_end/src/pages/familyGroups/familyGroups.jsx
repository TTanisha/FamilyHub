import React, {useEffect, useState} from 'react';
import FamilyGroup from '../../components/familyGroup/familyGroup';
import './familyGroups.css';
import axios from 'axios';
  
const FamilyGroups = () => {
  const [familyGroups, setFamilyGroups] = useState([]);
  const [data, setData] = useState([]);

  localStorage.setItem('currUser', JSON.stringify({"status":"success","message":"User found","data":{"user":{"_id":"63eab0277444ce6350404406","email":"testemail1@test.com","passwordHash":"test123","firstName":"Jane","lastName":"Doe","birthday":"2000-01-01T06:00:00.000Z","__v":0,"groups":["63eadff48963f22e0e89c297", "63eb38f82657e7477cabbe91"]}}}));

  const currentUser = JSON.parse(localStorage.getItem('currUser'));
  const newArray = currentUser.data.user.groups;

  useEffect(() => {
    setFamilyGroups(newArray);
  }, []);

  useEffect(() => {
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
    })
  )))}, [familyGroups]);

  return (
    <div className="familyGroupContainer">
      <div className="content">
      <div className="header"> My Family Groups </div>
         {
          data.map((groupData) => (
            <FamilyGroup groupId={groupData.group._id} groupName={groupData.group.groupName} groupMembers={groupData.group.groupMembers}/>
          ))
         } 
      </div>
    </div>
  );
};
  
export default FamilyGroups;