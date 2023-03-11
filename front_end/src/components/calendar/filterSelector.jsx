import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Checkbox, Spacer, Text} from "@nextui-org/react";

const FilterSelector = (props) => {
    let currUser = JSON.parse(localStorage.getItem("user")); 

    const [familyGroups, setFamilyGroups] = useState([]);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(currUser.groups)
  
    const familyGroupArray = currUser.groups;
  
    useEffect(() => {
        setSelected(familyGroupArray);
        setFamilyGroups(familyGroupArray);
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
        props.setFilter(selected);
    }, [selected])

    return ( 
        <>
            {/* Family group input */}
            <Spacer/>
            <Text h4 css={{display: "flex"}}>Filter by Family Group:</Text>
            <Checkbox.Group value={selected} onChange={setSelected}>
            {
                (data.length != 0) ? data.map((groupData) => (
                    <div key={groupData.group?._id}>
                        <Checkbox 
                            size="sm" 
                            value={groupData.group?._id}  
                            css={{
                                display: "flex", 
                            }}
                        > 
                            {groupData.group?.groupName} 
                        </Checkbox>
                    </div>
                )) : null
            }
            </Checkbox.Group>
        </>
    );
}

export default FilterSelector;