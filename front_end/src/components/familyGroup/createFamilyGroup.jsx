import React, { useState } from "react";
import axios from "axios";
import { Text, Modal, useModal, Button, Input } from "@nextui-org/react";
import * as Constants from "../../constants";

const CreateFamilyGroup = (props) => {
  let currUser = JSON.parse(localStorage.getItem(Constants.USER));

  const { setVisible, bindings } = useModal();

  //form input
  const [groupName, setGroupName] = useState(null);
  const [groupId, setGroupId] = useState(null);

  const submitCreateFamilyGroup = (props) => {
    axios
      .post("http://localhost:8080/api/familyGroups/createFamilyGroup", {
        groupName: groupName,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          console.log(response);
          resetFormState();
          addCreatorUser(response.data.group._id);
        }
      })
      .catch(function (error) {});
  };

  const addCreatorUser = (inGroupId) => {
    console.log(inGroupId);
    axios
      .post("http://localhost:8080/api/familyGroups/addMemberToFamilyGroup", {
        groupId: inGroupId,
        memberEmail: currUser.email,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          updateLocalStorage();
          console.log(response);
        }
      })
      .catch(function (error) {
        console.log("Error in Family Group");
      });
  };

  const updateLocalStorage = () => {
    axios
      .post("http://localhost:8080/api/users/getUserById", { id: currUser._id })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          const newUser = response.data.data.user;
          localStorage.setItem(Constants.USER, JSON.stringify(newUser));
          location.reload();
        }
      })
      .catch(function (error) {});
  };

  // reset the form states on close and successful submit
  const resetFormState = () => {
    setVisible(false);
    setGroupName(null);
  };

  return (
    <>
      <Button auto flat onPress={() => setVisible(true)}>
        Create Family Group
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
            Create Family Group
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            required
            label="Name"
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => resetFormState()}>
            Close
          </Button>
          <Button
            onPress={() => {
              submitCreateFamilyGroup(props);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateFamilyGroup;
