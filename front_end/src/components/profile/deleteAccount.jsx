import React from 'react';
import axios from 'axios';
import {Text, Modal, useModal, Button} from "@nextui-org/react";

const DeleteAccount = (props) => {

  const { setVisible, bindings } = useModal();
  //form input
  var currUser = JSON.parse(localStorage.getItem("user"));

  const deleteAccount = () => {
    axios.post("http://localhost:8080/api/users/deleteUser", 
    {
        email: currUser.email
    })
    .then(function(response)
    {
        if(response.data.status === "success")
        {
          localStorage.setItem("currUser", null);
          localStorage.setItem("loggedIn", false)
          location.reload();
          console.log(response);
        }
    }).catch(function (error) {
        console.log("User could not be deleted");
    })
  }

  return (
    <>
      <Button flat auto size="md" color="error" onPress={() => setVisible(true)}>
          Delete Account
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
            Are you sure you want to delete your account? 
          </Text>

        </Modal.Header>
        <Modal.Body> 
            <Text id="modal-title" size={15}>
                You will be removed from all of your family groups, but your events will still remain. 
            </Text>
            <Text id="modal-title" size={15}>
                If you would like to delete your events, please do so manually before deleting your account.
            </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => deleteAccount()}>
            Yes, delete my account
          </Button>
          <Button onPress={() => { {setVisible(false);}}}>
            No, keep my account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteAccount;