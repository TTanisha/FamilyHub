import React, {useEffect, useState} from 'react';
import FamilyGroup from '../../components/familyGroup/familyGroup';
import './familyGroups.css';
import axios from 'axios';
import { Collapse, Text, Card } from "@nextui-org/react";
  
const FamilyGroups = () => {
  const [familyGroups, setFamilyGroups] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  localStorage.setItem('currUser', JSON.stringify({"status":"success","message":"User found","data":{"user":{"_id":"63eab0277444ce6350404406","email":"testemail1@test.com","passwordHash":"test123","firstName":"Jane","lastName":"Doe","birthday":"2000-01-01T06:00:00.000Z","__v":0,"groups":["63eadff48963f22e0e89c297", "63eb38f82657e7477cabbe91"]}}}));

  const currentUser = JSON.parse(localStorage.getItem('currUser'));
  const familyGroupArray = currentUser.data.user.groups;

  useEffect(() => {
    setFamilyGroups(familyGroupArray);
  }, []);

  useEffect(() => {
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
}, [familyGroups]);

  return (
    <div className="familyGroupContainer">
      <div className="content">
        <Card css={{ $$cardColor: '$colors$gradient' }}> 
          <Text h3 color="#ffffff"> My Family Groups </Text> 
        </Card>

        <Collapse.Group splitted accordion={false}>
          { !loading && (
            (data.length != 0) ? data.map(
              (groupData) => (
              <Collapse key={groupData.group?._id} title={groupData.group?.groupName}> 
                <FamilyGroup key={groupData.group?._id} groupId={groupData.group?._id} groupName={groupData.group?.groupName} groupMembers={groupData.group?.groupMembers}/>
              </Collapse>)
            ) : <Text> You are not part of any family groups  </Text>)
          }
        </Collapse.Group>
      </div>
    </div>
  );
};
  
export default FamilyGroups;