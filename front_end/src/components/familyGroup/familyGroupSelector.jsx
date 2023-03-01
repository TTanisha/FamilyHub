import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Radio} from "@nextui-org/react";

const FamilyGroupSelector = (props) => {
    let currUser = JSON.parse(localStorage.getItem("user")); 

    const [familyGroup, setFamilyGroup] = useState(props.initialGroup);
    const [familyGroups, setFamilyGroups] = useState([]);
    const [data, setData] = useState([]);
  
    const familyGroupArray = currUser.groups;
  
    useEffect(() => {
      setFamilyGroups(familyGroupArray);
      setFamilyGroup(props.initialGroup);
    }, []);
  
    //retrieve family groups to get the group names
    useEffect(() => {
      if(familyGroups.length != 0) {
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
        )))
      }
    }, [familyGroups]);

    useEffect(() => {
        props.setFamilyGroup(familyGroup);
    }, [familyGroup])

    return ( 
        <>
            {/* Family group input */}
            <Radio.Group label="Family Group:" defaultValue={familyGroup} onChange={setFamilyGroup}>
            {
                (data.length != 0) ? data.map((groupData) => (
                    <div key={groupData.group?._id}>
                        <Radio size="sm" value={groupData.group?._id}> {groupData.group?.groupName} </Radio>
                    </div>
                )) : null
            }
            </Radio.Group>
        </>
    );
}

export default FamilyGroupSelector;