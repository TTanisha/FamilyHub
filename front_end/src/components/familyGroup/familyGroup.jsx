import React, { useEffect, useState } from 'react';
import "./familyGroup.css";
import axios from 'axios';
  
const FamilyGroup = (props) => {
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    setLoading(true);
    Promise.all(props.groupMembers.map(async (userId) => (
      //retrieve users using ID 
      await axios.post("http://localhost:8080/api/users/getUserById", {id: userId}, {cancelToken: source.token})
      .then(function(response)
      {
          if(response.data.status === "success")
          {          
            const newUser = response.data.data.user;
            setGroupMembers(prev => [...prev, newUser]);
            return response.data;
          }
      })
      .catch(function (error) {
        if(error.message!='canceled') {
          console.log(error)
        }})
      .finally(() => setLoading(false))
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
        !loading && (groupMembers?.map((userData) => ( loading ? null : <div className="memberName"> {userData?.firstName} {userData?.lastName}</div>))) 
      }
    </div>
  );
};
  
export default FamilyGroup;



