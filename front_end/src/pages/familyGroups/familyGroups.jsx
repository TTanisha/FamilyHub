import React, {useState} from 'react';
import FamilyGroup from '../../components/familyGroup/familyGroup';
import './familyGroups.css';


var fakeFamilyGroups = {
    familyGroups: [
        {
          id: "1",
          groupName: "Smith Family",
        },
        {
          id: "2",
          groupName: "Jones Family",
        },
    ]
};

  
const FamilyGroups = () => {
  const [familyGroups, setFamilyGroups] = useState(fakeFamilyGroups);

  return (
    <div className="familyGroupContainer">
      <div className="content">
      <div className="header"> My Family Groups </div>
      {familyGroups.familyGroups.map((familyGroups) => (
          <FamilyGroup groupId={familyGroups.id} groupName={familyGroups.groupName}/>
      ))}
      </div>
    </div>
  );
};
  
export default FamilyGroups;