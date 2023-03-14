import React, {useEffect, useState} from 'react';
import FamilyGroup from '../../components/familyGroup/familyGroup';
import CreateFamilyGroup from '../../components/familyGroup/createFamilyGroup';
import AddMemberFamilyGroup from '../../components/familyGroup/addMemberFamilyGroup';
import LeaveFamilyGroup from '../../components/familyGroup/leaveFamilyGroup';

import './familyGroups.css';
import axios from 'axios';
import { Collapse, Text, Card, Grid, Spacer} from "@nextui-org/react";
  
const FamilyGroups = () => {
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
          <Text h3 color="#ffffff"> My Family Groups </Text> 
        </Card>

        <Collapse.Group splitted accordion={false}>
          { !loading && (
            (data.length != 0) ? data.map(
              (groupData) => (
              <Collapse key={groupData.group?._id} title={groupData.group?.groupName}> 
                <FamilyGroup key={groupData.group?._id} groupId={groupData.group?._id} groupName={groupData.group?.groupName} groupMembers={groupData.group?.groupMembers}/>
                <Grid.Container gap={2} justify="center">
                  <Grid xs={4}>
                    <AddMemberFamilyGroup groupId={groupData.group?._id} />
                  </Grid>
                  <Spacer x={2} />
                  <Grid xs={4}>
                    <LeaveFamilyGroup  groupId={groupData.group?._id} groupName={groupData.group?.groupName} />
                  </Grid>
                </Grid.Container>
              </Collapse>)
            ) : <Text> You are not part of any family groups  </Text>)
          }
        </Collapse.Group>
        <CreateFamilyGroup/>

      </div>
    </div>
  );
};
  
export default FamilyGroups;