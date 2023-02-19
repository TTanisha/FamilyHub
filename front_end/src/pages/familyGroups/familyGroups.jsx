import React, {useEffect, useState} from 'react';
import FamilyGroup from '../../components/familyGroup/familyGroup';
import './familyGroups.css';
import axios from 'axios';
  
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
      <div className="header"> My Family Groups </div>
      { !loading && (
        (data.length != 0) ? data.map(
          (groupData) => (<FamilyGroup groupId={groupData.group?._id} groupName={groupData.group?.groupName} groupMembers={groupData.group?.groupMembers} />)
        ) : <div> You are not part of any family groups  </div>)
      }
      </div>
    </div>
  );
};
  
export default FamilyGroups;