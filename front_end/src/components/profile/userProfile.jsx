import React, { useEffect, useState } from 'react';
import "./userProfile.css";
import axios from 'axios';
import {Text, Card, Spacer} from "@nextui-org/react";
  

const UserProfile = (props) => {
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
        <div>
            {
                !loading && (groupMembers?.map((userData) => ( loading ? null : 
                <div key={userData?._id}> 
                    <Card isPressable isHoverable variant="bordered" css={{ backgroundColor: "white"}}>
                    <Text h4 css={{textAlign: "left"}}> 
                        {userData?.firstName} {userData?.lastName}
                    </Text>
                    </Card>
                <Spacer y={0.5} />
                </div>))) 
            }
        </div>
    );
};

export default UserProfile;