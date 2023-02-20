import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Text, Modal, useModal, Button, Card, Spacer, Input} from "@nextui-org/react";

const CreateEventForm = (props) => {
  let currUser = JSON.parse(localStorage.getItem("user"));

  const { setVisible, bindings } = useModal();

  //form input
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState(""); 
  const [endTimeInput, setEndTimeInput] = useState(""); 
  const [locationInput, setLocationInput] = useState("");
  const [isAllDay, setIsAllDay] = useState(false); 
  const [recurrenceRule, setRecurrenceRule] = useState("ONCE"); 
  const [familyGroup, setFamilyGroup] = useState(currUser.groups[0]);

  //transformed data 
  const [date, setDate] = useState();
  const [startTimeDate, setStartTimeDate] = useState(); 
  const [endTimeDate, setEndTimeDate] = useState(); 

  useEffect(() => {
    if(dateInput) {
      setDate(new Date(dateInput));
    }

    if(date) {
      if(startTimeInput) {
        setStartTimeDate(new Date(dateInput + " " + startTimeInput));
      }

      if(endTimeInput) {
        setEndTimeDate(new Date(dateInput + " " + endTimeInput))
      }
    }
  }, [dateInput, startTimeInput, endTimeInput]);


  useEffect(() => {

    console.log(startTimeDate);
    console.log(endTimeDate);
  });

  const submitCreateEventForm = () => {
    axios.post("http://localhost:8080/api/events/createEvent", 
    {
      title: titleInput, 
      body: descriptionInput,
      creationUser: currUser._id, 
      isAllDay: isAllDay, 
      start: startTimeDate, 
      end: endTimeDate, 
      location: locationInput, 
      recurrenceRule: recurrenceRule, 
      familyGroup: familyGroup
    })
    .then(function(response)
    {
        if(response.data.status === "success")
        {
          console.log(response);
          setVisible(false);
        }
    }).catch(function (error) {
    })

  }

  return (
    <>
      <Button auto flat onPress={() => setVisible(true)}>
          Create Event
      </Button>
      <Modal
        scroll
        closeButton
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Create Event
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input required label='Title' onChange={e => setTitleInput(e.target.value)}/>
          <Input required label='Description' onChange={e => setDescriptionInput(e.target.value)}/>
          <Input required label='Date' type='date' onChange={e => setDateInput(e.target.value)}/>
          <Input required label='Start Time' type='time' onChange={e => setStartTimeInput(e.target.value)}/>
          <Input required label='End Time' type='time' onChange={e => setEndTimeInput(e.target.value)}/>
          <Input label='Location' onChange={e => setLocationInput(e.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => setVisible(false)}>
            Close
          </Button>
          <Button onPress={submitCreateEventForm}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateEventForm;