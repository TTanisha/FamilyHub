import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Text, Modal, useModal, Button, Grid, Spacer, Input, Textarea, Checkbox, Radio} from "@nextui-org/react";

const LeaveFamilyGroup = (props) => {

  const { setVisible, bindings } = useModal();
  //form input
  const [newMemberEmail, setNewMemberEmail] = useState(null);
  
  const submitAddMember = (props) => {
    axios.post("http://localhost:8080/api/familyGroups/addMemberToFamilyGroup", 
    {
        groupId: props.groupId, 
        memberEmail: newMemberEmail
    })
    .then(function(response)
    {
        if(response.data.status === "success")
        {
            location.reload();
            console.log(response);
        }
    }).catch(function (error) {
        console.log("Error in Family Group");
    })
  }

  
  // reset the form states on close and successful submit
  const resetFormState = () => {
    setVisible(false); 
    setNewMemberEmail(null);
  }

  return (
    <>
      <Button auto flat color="error" onPress={() => setVisible(true)}>
          Leave Group
      </Button>
      <Modal
        scroll
        closeButton
        width={650}
        preventClose
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Are you sure you want to leave this group?
          </Text>
        </Modal.Header>
        <Modal.Body> 
          <Text size="$md" > Family Group: Juan's Group  </Text> 
        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => resetFormState()}>
            Leave this group
          </Button>
          <Button onPress={() => {submitAddMember(props)}}>
            Stay in this group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveFamilyGroup;