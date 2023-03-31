import React from "react";
import axios from "axios";
import { Text, Modal, useModal, Button } from "@nextui-org/react";
import * as Constants from "../../constants";

const DeleteRecurrence = (props) => {
  const { setVisible, bindings } = useModal();

  var currUser = JSON.parse(localStorage.getItem(Constants.USER));

  const deleteRecurrence = (props) => {
    axios
      .post("http://localhost:8080/api/events/deleteRecurrence", {
        recurrenceId: props.eventInfo.event.raw.recurrenceId,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          location.reload();
        }
      })
      .catch(function (error) {
        window.alert(error.response.data.message);
      });
  };

  const deleteEvent = (props) => {
    axios
      .post("http://localhost:8080/api/events/deleteEvent", {
        id: props.eventInfo.event.id,
        creationUser: currUser._id,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          location.reload();
        }
      })
      .catch(function (error) {
        window.alert(error.response.data.message);
      });
  };

  return (
    <>
      <Button auto flat color="error" onPress={() => setVisible(true)}>
        Delete
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
            Do you want to delete this event or the entire recurrence series?
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text size="$md"> Delete: {props.eventName} </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button
            flat
            auto
            color="error"
            onPress={() => deleteEvent(props.eventProps)}
          >
            Delete this event
          </Button>
          <Button
            flat
            auto
            color="error"
            onPress={() => deleteRecurrence(props.eventProps)}
          >
            Delete the entire series
          </Button>
          <Button
            onPress={() => {
              {
                setVisible(false);
              }
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteRecurrence;
