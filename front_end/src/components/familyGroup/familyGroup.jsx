import React, { useState } from 'react';
import "./familyGroup.css";

var fakeFamilyMembersGroup1 = {
  members: [
      {
        id: "1",
        memberName: "Sally",
      },
      {
        id: "2",
        memberName: "Jane",
      },
  ]
};

var fakeFamilyMembersGroup2 = {
  members: [
      {
        id: "3",
        memberName: "Bob",
      },
      {
        id: "4",
        memberName: "Jack",
      },
      {
        id: "4",
        memberName: "Joe",
      },
  ]
};
  
const FamilyGroup = (props) => {
  return (
    <div className="familyContainer">
      <div className="familyName"> {props.groupName} </div>
      {props.groupId == 1 ? 
        fakeFamilyMembersGroup1.members.map((member) => (<div className="memberName"> {member.memberName} </div>)) 
        : fakeFamilyMembersGroup2.members.map((member) => ( <div className="memberName"> {member.memberName} </div>))}
    </div>
  );
};
  
export default FamilyGroup;



