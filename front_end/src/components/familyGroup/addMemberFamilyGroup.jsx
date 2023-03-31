import React, { useState } from "react";
import axios from "axios";
import { Text, Modal, useModal, Button, Input } from "@nextui-org/react";
import * as Constants from "../../constants";

const AddMemberFamilyGroup = (props) => {
  const { setVisible, bindings } = useModal();
  //form input
  const [newMemberEmail, setNewMemberEmail] = useState(null);

  const submitAddMember = (props) => {
    axios
      .post("http://localhost:8080/api/familyGroups/addMemberToFamilyGroup", {
        groupId: props.groupId,
        memberEmail: newMemberEmail,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          location.reload();
          console.log(response);
        }
      })
      .catch(function (error) {
        window.alert(error.response.data.message);
      });
  };

  // reset the form states on close and successful submit
  const resetFormState = () => {
    setVisible(false);
    setNewMemberEmail(null);
  };

  return (
    <>
      <Button auto flat onPress={() => setVisible(true)}>
        Add Member
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
            Add Member
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            required
            label="Email: "
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => resetFormState()}>
            Close
          </Button>
          <Button
            onPress={() => {
              submitAddMember(props);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddMemberFamilyGroup;
