import React, { useEffect, useState } from 'react';
import "./familyGroup.css";
import axios from 'axios';
  
const FamilyGroup = (props) => {
  const [groupMembers, setGroupMembers] = useState([]);
  
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    Promise.all(props.groupMembers.map((userId) => (
      //retrieve group objects using ID 
      axios.post("http://localhost:8080/api/users/getUserById", {userId: userId}, {cancelToken: source.token})
      .then(function(response)
      {
          if(response.data.status === "success")
          {          
            const newUser = response.data.data;
            setGroupMembers(prev => [...prev, newUser]);
            return response.data;
          }
      })
      .catch(function (error) {
      })
    )))

    return () => {
      //cleanup 
      source.cancel();
    }
  }, [])

  return (
    <div className="familyContainer">
      <div className="familyName"> {props.groupName} </div>
      {
        groupMembers.map((userData) => ( <div className="memberName"> {userData.user[0].firstName} {userData.user[0].lastName}</div>)) 
      }
    </div>
  );
};
  
export default FamilyGroup;



