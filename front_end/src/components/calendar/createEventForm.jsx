import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, Modal, useModal, Button, Grid, Spacer, Input, Textarea, Checkbox, Dropdown } from "@nextui-org/react";
import FamilyGroupSelector from '../familyGroup/familyGroupSelector';

const CreateEventForm = (props) => {
  let currUser = JSON.parse(localStorage.getItem("user"));

  const { setVisible, bindings } = useModal();

  //form input
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState(""); 
  const [endTimeInput, setEndTimeInput] = useState(""); 
  const [locationInput, setLocationInput] = useState("");
  const [isAllDay, setIsAllDay] = useState(false); 
  const [recurring, setRecurring] = useState(false); 
  const [numRecurrences, setNumrecurrences] = useState(1); 
  const [recurrenceRule, setrecurrenceRule] = useState("ONCE");
  const [selectedFrequency, setSelectedFrequency] = useState("ONCE");
  const [familyGroup, setFamilyGroup] = useState(currUser.groups[0]);

  //transformed data 
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startTimeDate, setStartTimeDate] = useState(); 
  const [endTimeDate, setEndTimeDate] = useState(); 

  //update start date/time if input is updated
  useEffect(() => {
    if(startDateInput) {
      setStartDate(new Date(startDateInput));
    }
  }, [isAllDay, startDateInput, startTimeInput]);

  useEffect(() => {
    if(startDate) {
      if(!isAllDay) {
        if(startTimeInput) {
          setStartTimeDate(new Date(startDateInput + " " + startTimeInput));
        }
      } else {
        setStartTimeDate(new Date(startDateInput));
      }
    }
  }, [startDate, startTimeInput])

  //update end date/time if input is updated
  useEffect(() => {
    if(endDateInput) {
      setEndDate(new Date(endDateInput)); 
    }
  }, [isAllDay, endDateInput, endTimeInput])

  useEffect(() => {
    if(endDate) {
      if(!isAllDay) {
        if(endTimeInput) {
          setEndTimeDate(new Date(endDateInput + " " + endTimeInput));
        }
      } else {
        setEndTimeDate(new Date(endDateInput));
      }
    }
  }, [endDate, endTimeInput])

  useEffect(() => {
    setSelectedFrequency(recurrenceRule.currentKey ? recurrenceRule.currentKey : recurrenceRule);
  }, [recurrenceRule])

  //reset time inputs if 'All Day' is toggled off 
  useEffect(() => {
    if(!isAllDay) {
      setStartTimeDate(null);
      setEndTimeDate(null);
      setEndTimeInput(null);
      setStartTimeInput(null);
    }
  }, [isAllDay])

  const submitCreateEventForm = (props) => {
    if(!recurring) {
      axios.post("http://localhost:8080/api/events/createEvent", 
      {
        title: titleInput, 
        body: descriptionInput,
        creationUser: currUser._id, 
        isAllDay: isAllDay, 
        start: startTimeDate, 
        end: endTimeDate, 
        location: locationInput, 
        recurrenceRule: "ONCE", 
        familyGroup: familyGroup
      })
      .then(function(response)
      {
          if(response.data.status === "success")
          {
            console.log(response);
            resetFormState();
            props.updateEvents();
          }
      }).catch(function (error) {
        window.alert(error.response.data.message);
      })
    } else {
      let startDate = new Date(startDateInput);
      let endDate = new Date(endDateInput);

      if(startTimeInput) 
      {
        startDate = new Date(startDateInput + " " + startTimeInput);
        endDate = new Date(endDateInput + " " + endTimeInput);
      }

      axios.post("http://localhost:8080/api/events/createEvent", 
      {
        title: titleInput, 
        body: descriptionInput,
        creationUser: currUser._id, 
        isAllDay: isAllDay, 
        start: startDate, 
        end: endDate, 
        location: locationInput, 
        recurrenceRule: selectedFrequency, 
        recurrenceNum: numRecurrences, 
        familyGroup: familyGroup
      })
      .then(function(response)
      {
          if(response.data.status === "success")
          {
            console.log(response);
            resetFormState();
            props.updateEvents();
          }
      }).catch(function (error) {
        window.alert(error.response.data.message);
      })
    }
  }

  const setFamilyGroupFromSelector = (id) => {
    setFamilyGroup(id);
  }

  // reset the form states on close and successful submit
  const resetFormState = () => {
    setVisible(false); 
    setIsAllDay(false);
    setFamilyGroup(currUser.groups[0]);
    setTitleInput(null);
    setDescriptionInput(null);
    setStartDateInput(null);
    setEndDateInput(null);
    setStartTimeInput(null);
    setEndTimeInput(null);
    setLocationInput(null);
    setStartDate(null);
    setEndDate(null);
    setStartTimeDate(null);
    setEndTimeDate(null);
    setRecurring(false);
    setSelectedFrequency("ONCE");
    setrecurrenceRule("ONCE");
  }

  return (
    <>
      <Button auto flat onPress={() => setVisible(true)}>
          Create Event
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
            Create Event
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input required label='Title' onChange={e => setTitleInput(e.target.value)}/>
          {/* Date input */}
          <Grid.Container>
            <Grid> 
              <Grid.Container direction='column'> 
                <Grid>
                  <Input required label='Start Date' type='date' max='9999-12-31' onChange={e => setStartDateInput(e.target.value)}/>
                </Grid>
                { !isAllDay &&
                  <Grid>
                    <Input required label='Start Time' type='time' onChange={e => setStartTimeInput(e.target.value)}/>
                  </Grid>
                }  
              </Grid.Container>
            </Grid>
            <Spacer y={3} x={1}/>
            <Grid> 
              <Spacer y={isAllDay? 1.5 : 3 } x={2}/>
              <Text> To </Text>
            </Grid>
            <Grid xs={3}> 
              <Grid.Container direction='column'>
                <Grid>
                  <Input required label='End Date' type='date' max='9999-12-31' onChange={e => setEndDateInput(e.target.value)}/>
                  </Grid>
                { !isAllDay &&
                  <Grid>
                    <Input required label='End Time' type='time' onChange={e => setEndTimeInput(e.target.value)}/>
                  </Grid>
                }
              </Grid.Container>
            </Grid>
          </Grid.Container>
          <Checkbox size="sm" onChange={setIsAllDay}> All day </Checkbox>
          
        {/* Recurring Event */ }
          <Grid.Container>
            <Grid> 
              <Grid.Container direction='column'> 
                <Grid>
                <Checkbox size="sm" onChange={setRecurring}> Recurring </Checkbox>
                </Grid>
              </Grid.Container>
            </Grid>
            <Spacer y={1} x={10.5}/>
            { recurring &&
              <Grid xs={5}> 
                <Grid.Container direction='column'>
                  <Grid>
                    <Dropdown>
                      <Dropdown.Button size="md" auto flat>{selectedFrequency}</Dropdown.Button>
                      <Dropdown.Menu aria-label="Static Actions" disallowEmptySelection selectionMode="single" selectedKeys={recurrenceRule} onSelectionChange={setrecurrenceRule}>
                        <Dropdown.Item aria-label="DAILY" key="DAILY">DAILY</Dropdown.Item>
                        <Dropdown.Item aria-label="WEEKLY" key="WEEKLY">WEEKLY</Dropdown.Item>
                        <Dropdown.Item aria-label="MONTHLY" key="MONTHLY">MONTHLY</Dropdown.Item>
                        <Dropdown.Item aria-label="YEARLY" key="YEARLY">YEARLY</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    </Grid>
                </Grid.Container>
                <Grid.Container direction='column'>
                  <Grid>
                    { recurrenceRule!="ONCE" && 
                      <Input width="120px" aria-label="numRecurrence" type='number' initialValue='1' onChange={e => setNumrecurrences(e.target.value)}/>
                    }
                  </Grid>
                </Grid.Container>
              </Grid>
            }
          </Grid.Container>

          <FamilyGroupSelector initialGroup={familyGroup} setFamilyGroup={setFamilyGroupFromSelector}/>

          <Textarea minRows={3} maxRows={10} label='Description' onChange={e => setDescriptionInput(e.target.value)}/>
          <Input label='Location' onChange={e => setLocationInput(e.target.value)}/>

        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => resetFormState()}>
            Close
          </Button>
          <Button onPress={() => {submitCreateEventForm(props)}}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateEventForm;

