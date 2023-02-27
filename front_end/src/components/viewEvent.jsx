import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Text, Modal, Button, Input} from "@nextui-org/react";

const ViewEvent = (props) => {
  let currUser = JSON.parse(localStorage.getItem("user"));

  const currEvent = props.eventInfo.event;

  //set details of current event
  const title = currEvent?.title;
  const description = currEvent?.body;
  const location = currEvent?.location;

  //parse start date to get the proper string format 
  const startDateObject = currEvent?.start.d;
  const startYear = startDateObject?.getFullYear();
  const startMonth = startDateObject?.getMonth();
  const startDate = startDateObject?.getDate();
  const startHour = startDateObject?.getHours();
  const startMinutes = startDateObject?.getMinutes();

  //parse end date to get the proper string format 
  const endDateObject = currEvent?.end.d;
  const endYear = endDateObject?.getFullYear();
  const endMonth = endDateObject?.getMonth();
  const endDate = endDateObject?.getDate();
  const endHour = endDateObject?.getHours();
  const endMinutes = endDateObject?.getMinutes();

  //formatted date and time strings
  const startDateString = startYear + "-" + ((startMonth+1)<10 ? "0" : "") + (startMonth+1)  + "-" + (startDate<10 ? "0" : "") + startDate;
  const startTimeString = (startHour<10? "0" : "") + startHour + ":" + (startMinutes<10 ? "0" : "") + startMinutes;
  const endTimeString = (endHour<10? "0" : "") + endHour + ":" + (endMinutes<10 ? "0" : "") + endMinutes;

  const [editMode, setEditMode] = useState(false);
  
  //form input
  const [titleInput, setTitleInput] = useState();
  const [descriptionInput, setDescriptionInput] = useState();
  const [dateInput, setDateInput] = useState();
  const [startTimeInput, setStartTimeInput] = useState(); 
  const [endTimeInput, setEndTimeInput] = useState(); 
  const [locationInput, setLocationInput] = useState(location);
  const [isAllDay, setIsAllDay] = useState(false); 
  const [recurrenceRule, setRecurrenceRule] = useState("ONCE"); 
  const [familyGroup, setFamilyGroup] = useState(currUser.groups[0]);

  //transformed data 
  const [date, setDate] = useState();
  const [startTimeDate, setStartTimeDate] = useState(); 
  const [endTimeDate, setEndTimeDate] = useState(); 

  //set input data once current event is loaded
  useEffect(() => {
    if(currEvent) {
      setDateInput(startDateString);
      setStartTimeInput(startTimeString);
      setEndTimeInput(endTimeString);
      setTitleInput(title); 
      setDescriptionInput(description);
    }
    
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
  }, [currEvent]);

  //update date and time if date input is updated
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
  }, [dateInput]);

  //update start time if date or start time input is updated
  useEffect(() => {
    if(startTimeInput) {
      setStartTimeDate(new Date(dateInput + " " + startTimeInput));
    }
  }, [dateInput, startTimeInput]);

  //update end time if date or end time input is updated
  useEffect(() => {
    if(endTimeInput) {
      setEndTimeDate(new Date(dateInput + " " + endTimeInput))
    }
  }, [dateInput, endTimeInput]);
  
  const submitUpdateEventForm = (props) => {
    axios.post("http://localhost:8080/api/events/updateEvent", 
    {
      id: currEvent?.id,
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
          props.setVisible(false);
          props.updateEvents();
        }
    }).catch(function (error) {
    })
  }

  return (
    <div>
      <Modal
        open={props.visible}
        onClose={() => props.setVisible(false)}
        scroll
        preventClose={editMode}
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >

        <Modal.Header>
          <Text id="modal-title" size={25}>
            {editMode ? "Edit: " + props.eventInfo.event?.title : props.eventInfo.event?.title}
          </Text>
        </Modal.Header>

        <Modal.Body>
          <Input
            aria-label="Event Title"
            readOnly={!editMode}
            label={editMode ? "Event Title" : ""}
            labelLeft={editMode ? "" : "Event Title"}
            initialValue={title}
            onChange={e => setTitleInput(e.target.value)}
          />
          <Input
            aria-label="Date"
            readOnly={!editMode}
            required
            label={editMode ? "Date" : ""}
            labelLeft={editMode ? "" : "Date"}
            type='date'
            initialValue={startDateString}
            onChange={e => setDateInput(e.target.value)}
          />
          <Input
            aria-label="Start Time"
            readOnly={!editMode}
            required
            label={editMode ? "Start Time" : ""}
            labelLeft={editMode ? "" : "Start Time"}
            type='time'
            initialValue={startTimeString}
            onChange={e => setStartTimeInput(e.target.value)}
          />
          <Input
            aria-label="End Time"
            readOnly={!editMode}
            required
            label={editMode ? "End Time" : ""}
            labelLeft={editMode ? "" : "End Time"}
            type='time'
            initialValue={endTimeString}
            onChange={e => setEndTimeInput(e.target.value)}
          />
          <Input
            aria-label="Description"
            readOnly={!editMode}
            required
            label={editMode ? "Description" : ""}
            labelLeft={editMode ? "" : "Description"}
            initialValue={description}
            onChange={e => setDescriptionInput(e.target.value)}
          />
          <Input
            aria-label="Location"
            readOnly={!editMode}
            label={editMode ? "Location" : ""}
            labelLeft={editMode ? "" : "Location"}
            initialValue={location}
            onChange={e => setLocationInput(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button auto flat color="default"
            onPress={() => {
              if (editMode) {
                setEditMode(false);
                submitUpdateEventForm(props)
              } else {
                setEditMode(true)
              }
            }}>
            {editMode ? "Save" : "Edit"}
          </Button>

          {editMode &&
            <Button auto flat color="error"
              onPress={() => { 
                setEditMode(false) 
              }}>
              Cancel
            </Button>
          }

          <Button auto flat color="error"
            onPress={() => {
              props.setVisible(false);
              setEditMode(false)
            }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  )
}

export default ViewEvent;