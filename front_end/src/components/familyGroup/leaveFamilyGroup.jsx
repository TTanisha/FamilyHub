import React from "react";
import axios from "axios";
import { Text, Modal, useModal, Button } from "@nextui-org/react";
import * as Constants from "../../constants";

const LeaveFamilyGroup = (props) => {
  const { setVisible, bindings } = useModal();
  //form input
  var currUser = JSON.parse(localStorage.getItem(Constants.USER));

  const leaveGroup = () => {
    axios
      .post("http://localhost:8080/api/familyGroups/leaveFamilyGroup", {
        groupId: props.groupId,
        memberId: currUser._id,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          updateLocalStorage(currUser, props.groupId);
          location.reload();
          console.log(response);
        }
      })
      .catch(function (error) {
        console.log("Error in Family Group");
      });
  };

  const updateLocalStorage = (inputUser, groupId) => {
    let updatedGroups = currUser.groups;
    for (let i = 0; i < updatedGroups.length; i++) {
      if (updatedGroups[i] == groupId) {
        updatedGroups.splice(i, 1);
      }
    }
    currUser.groups = updatedGroups;
    localStorage.setItem(Constants.USER, JSON.stringify(inputUser));
  };

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
          <Text size="$md"> Family Group: {props.groupName} </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => leaveGroup()}>
            Leave this group
          </Button>
          <Button
            onPress={() => {
              {
                setVisible(false);
              }
            }}
          >
            Stay in this group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveFamilyGroup;
