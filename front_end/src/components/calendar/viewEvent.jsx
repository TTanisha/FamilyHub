import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Text,
  Modal,
  Button,
  Input,
  Grid,
  Spacer,
  Checkbox,
  Textarea,
  Dropdown,
} from "@nextui-org/react";
import FamilyGroupSelector from "../familyGroup/familyGroupSelector";
import DeleteRecurrence from "./deleteRecurrence";
import * as Constants from "../../constants";

const ViewEvent = (props) => {
  let currUser = JSON.parse(localStorage.getItem(Constants.USER));

  const currEvent = props.eventInfo.event;

  //set details of current event
  const title = currEvent?.title;
  const description = currEvent?.body;
  const location = currEvent?.location;
  const allDay = currEvent?.isAllday;
  const groupId = currEvent?.calendarId;
  const groupName = props.groupName;
  const creationUser = currEvent?.raw?.creationUser;
  const recurrenceRuleString = currEvent?.raw?.recurrenceRule;
  const recurrenceNum = currEvent?.raw?.recurrenceNum;
  const recurrenceId = currEvent?.raw?.recurrenceId;

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

  //formatted date and time strings (month and date should have leading 0 if < 10, i.e. 2023-01-03)
  const startDateString =
    startYear +
    "-" +
    (startMonth + 1 < 10 ? "0" : "") +
    (startMonth + 1) +
    "-" +
    (startDate < 10 ? "0" : "") +
    startDate;

  const endDateString =
    endYear +
    "-" +
    (endMonth + 1 < 10 ? "0" : "") +
    (endMonth + 1) +
    "-" +
    (endDate < 10 ? "0" : "") +
    endDate;

  const startTimeString =
    (startHour < 10 ? "0" : "") +
    startHour +
    ":" +
    (startMinutes < 10 ? "0" : "") +
    startMinutes;

  const endTimeString =
    (endHour < 10 ? "0" : "") +
    endHour +
    ":" +
    (endMinutes < 10 ? "0" : "") +
    endMinutes;

  const [editMode, setEditMode] = useState(false);
  const [editRecurringMode, setEditRecurringMode] = useState(false);
  const [editSingleMode, setEditSingleMode] = useState(false);

  //form input
  const [titleInput, setTitleInput] = useState();
  const [descriptionInput, setDescriptionInput] = useState();
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [endTimeInput, setEndTimeInput] = useState("");
  const [locationInput, setLocationInput] = useState(location);
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState(Constants.ONCE);
  const [familyGroup, setFamilyGroup] = useState(groupId);
  const [familyGroupName, setFamilyGroupName] = useState("");
  const [isCreationUser, setIsCreationUser] = useState(false);

  //transformed data
  const [startTimeDate, setStartTimeDate] = useState();
  const [endTimeDate, setEndTimeDate] = useState();

  const [startTimeStringState, setStartTimeStringState] =
    useState(startTimeString);
  const [endTimeStringState, setEndTimeStringState] = useState(endTimeString);

  const [recurring, setRecurring] = useState(false);
  const [numRecurrences, setNumRecurrences] = useState(1);
  const [selectedFrequency, setSelectedFrequency] = useState(Constants.ONCE);

  //set input data once current event is loaded
  useEffect(() => {
    setDefaultValues();
  }, [currEvent]);

  const setDefaultValues = () => {
    setStartDateInput(startDateString);
    setStartTimeInput(startTimeString);
    setEndDateInput(endDateString);
    setEndTimeInput(endTimeString);
    setTitleInput(title);
    setDescriptionInput(description);
    setStartTimeStringState(startTimeString);
    setEndTimeStringState(endTimeString);
    setFamilyGroup(groupId);
    setIsAllDay(allDay);
    setFamilyGroupName(groupName);
    setIsCreationUser(currUser._id == creationUser);
    setLocationInput(location);
    setRecurrenceRule(recurrenceRuleString);
    setRecurring(recurrenceRuleString != Constants.ONCE);
    setNumRecurrences(recurrenceNum);
    setSelectedFrequency(recurrenceRuleString);
  };

  //update start date/time if input is updated
  useEffect(() => {
    if (startDateInput) {
      if (!isAllDay) {
        if (startTimeInput) {
          setStartTimeDate(new Date(startDateInput + " " + startTimeInput));
        }
      } else {
        setStartTimeDate(new Date(startDateInput));
      }
    }
  }, [isAllDay, startDateInput, startTimeInput]);

  //update end date/time if input is updated
  useEffect(() => {
    if (endDateInput) {
      if (!isAllDay) {
        if (endTimeInput) {
          setEndTimeDate(new Date(endDateInput + " " + endTimeInput));
        }
      } else {
        setEndTimeDate(new Date(endDateInput));
      }
    }
  }, [isAllDay, endDateInput, endTimeInput]);

  //on initial load, if it's an all day event, ignore time inputs
  useEffect(() => {
    if (isAllDay) {
      setEndTimeInput(null);
      setStartTimeInput(null);
      setStartTimeStringState(null);
      setEndTimeStringState(null);
    }
  }, []);

  //reset time inputs if 'All Day' is toggled off
  //if 'All Day' is on, ignore time inputs
  useMemo(() => {
    if (isAllDay) {
      setEndTimeInput(null);
      setStartTimeInput(null);
      setStartTimeStringState(null);
      setEndTimeStringState(null);
    } else {
      setStartTimeDate(null);
      setEndTimeDate(null);
    }
  }, [isAllDay]);

  const submitUpdateSingleEventForm = (props) => {
    axios
      .post("http://localhost:8080/api/events/updateEvent", {
        id: currEvent?.id,
        title: titleInput,
        body: descriptionInput,
        creationUser: currUser._id,
        isAllDay: isAllDay,
        start: startTimeDate,
        end: endTimeDate,
        location: locationInput,
        recurrenceRule: recurrenceRule,
        familyGroup: familyGroup,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          props.setVisible(false);
          setEditMode(false);
          props.clearGroupName();
          props.updateEvents();
        }
      })
      .catch(function (error) {
        window.alert(error.response.data.message);
      });
  };

  const submitUpdateRecurrenceForm = (props) => {
    axios
      .post("http://localhost:8080/api/events/updateRecurrence", {
        id: currEvent?.id,
        title: titleInput,
        body: descriptionInput,
        creationUser: currUser._id,
        isAllDay: isAllDay,
        start: startTimeDate,
        end: endTimeDate,
        location: locationInput,
        recurrenceRule: selectedFrequency,
        recurrenceNum: numRecurrences,
        recurrenceId: recurrenceId,
        familyGroup: familyGroup,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          props.setVisible(false);
          setEditMode(false);
          props.clearGroupName();
          props.updateEvents();
        }
      })
      .catch(function (error) {
        window.alert(error.response.data.message);
      });
  };

  const deleteEvent = (props) => {
    axios
      .post("http://localhost:8080/api/events/deleteEvent", {
        id: currEvent?.id,
        creationUser: currUser._id,
      })
      .then(function (response) {
        if (response.data.status === Constants.SUCCESS) {
          props.setVisible(false);
          props.clearGroupName();
          props.updateEvents();
        }
      })
      .catch(function (error) {
        window.alert(error.response.data.message);
      });
  };

  const setFamilyGroupFromSelector = (id) => {
    setFamilyGroup(id);
  };

  const resetEventDetails = () => {
    setEditMode(false);
    setEditRecurringMode(false);
    setEditSingleMode(false);
    setDefaultValues();
  };

  return (
    <div>
      <Modal
        open={props.visible}
        onClose={() => props.setVisible(false)}
        scroll
        preventClose={editMode}
        width="650px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Modal.Header>
          <Text id="modal-title" size={25}>
            {editMode
              ? "Edit: " + props.eventInfo.event?.title
              : props.eventInfo.event?.title}
          </Text>
        </Modal.Header>

        <Modal.Body>
          <Input
            aria-label="Event Title"
            readOnly={!editMode}
            label={editMode ? "Event Title" : ""}
            labelLeft={editMode ? "" : "Event Title"}
            initialValue={title}
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />

          {/* Date details & input */}
          <Grid.Container>
            {/* Start Date & Time */}
            <Grid>
              <Grid.Container direction="column" gap={1}>
                <Grid>
                  <Input
                    aria-label="Start Date"
                    required
                    readOnly={!editMode}
                    label={editMode ? "Start Date" : ""}
                    labelLeft={editMode ? "" : "Start Date"}
                    type="date"
                    max="9999-12-31"
                    initialValue={startDateString}
                    onChange={(e) => setStartDateInput(e.target.value)}
                  />
                </Grid>
                {!isAllDay && (
                  <Grid>
                    <Input
                      aria-label="Start Time"
                      required
                      readOnly={!editMode}
                      label={editMode ? "Start Time" : ""}
                      labelLeft={editMode ? "" : "Start Time"}
                      type="time"
                      initialValue={startTimeStringState}
                      onChange={(e) => setStartTimeInput(e.target.value)}
                    />
                  </Grid>
                )}
              </Grid.Container>
            </Grid>

            <Spacer y={3} x={1} />
            <Grid>
              <Spacer y={isAllDay ? 0.5 : 1.5} x={2} />
              <Text> To </Text>
            </Grid>

            {/* End Date & Time */}
            <Grid xs={3}>
              <Grid.Container direction="column" gap={1}>
                <Grid>
                  <Input
                    aria-label="End Date"
                    required
                    readOnly={!editMode}
                    label={editMode ? "End Date" : ""}
                    labelLeft={editMode ? "" : "End Date"}
                    type="date"
                    max="9999-12-31"
                    initialValue={endDateString}
                    onChange={(e) => setEndDateInput(e.target.value)}
                  />
                </Grid>
                {!isAllDay && (
                  <Grid>
                    <Input
                      aria-label="End Time"
                      required
                      readOnly={!editMode}
                      label={editMode ? "End Time" : ""}
                      labelLeft={editMode ? "" : "End Time"}
                      type="time"
                      initialValue={endTimeStringState}
                      onChange={(e) => setEndTimeInput(e.target.value)}
                    />
                  </Grid>
                )}
              </Grid.Container>
            </Grid>
          </Grid.Container>

          {!isAllDay && <Spacer y={0.25} />}

          {/* Edit Mode - All Day & Family Group Selectors */}
          {editMode && (
            <div>
              <Checkbox size="sm" isSelected={isAllDay} onChange={setIsAllDay}>
                All day
              </Checkbox>

              <FamilyGroupSelector
                initialGroup={familyGroup}
                setFamilyGroup={setFamilyGroupFromSelector}
              />
            </div>
          )}

          {/* Recurrence - edit mode*/}
          {editMode && editRecurringMode && (
            <>
              <Grid.Container>
                <Grid>
                  <Grid.Container direction="column">
                    <Grid>
                      <Checkbox
                        size="sm"
                        isSelected={recurring}
                        readOnly
                      >
                        Recurring
                      </Checkbox>
                    </Grid>
                  </Grid.Container>
                </Grid>
                <Spacer y={1} x={10.5} />
                {recurring && (
                  <Grid xs={5}>
                    <Grid.Container direction="column">
                      <Grid>
                        <Dropdown>
                          <Dropdown.Button size="md" auto flat>
                            {selectedFrequency}
                          </Dropdown.Button>
                          <Dropdown.Menu
                            aria-label="Static Actions"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={recurrenceRule}
                            onSelectionChange={setRecurrenceRule}
                          >
                            <Dropdown.Item
                              aria-label={Constants.DAILY}
                              key={Constants.DAILY}
                            >
                              {Constants.DAILY}
                            </Dropdown.Item>
                            <Dropdown.Item
                              aria-label={Constants.WEEKLY}
                              key={Constants.WEEKLY}
                            >
                              {Constants.WEEKLY}
                            </Dropdown.Item>
                            <Dropdown.Item
                              aria-label={Constants.MONTHLY}
                              key={Constants.MONTHLY}
                            >
                              {Constants.MONTHLY}
                            </Dropdown.Item>
                            <Dropdown.Item
                              aria-label={Constants.YEARLY}
                              key={Constants.YEARLY}
                            >
                              {Constants.YEARLY}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Grid>
                    </Grid.Container>
                    <Grid.Container direction="column">
                      <Grid>
                        {recurrenceRule != "ONCE" && (
                          <Input
                            width="120px"
                            aria-label="numRecurrence"
                            type="number"
                            min="1"
                            initialValue={numRecurrences}
                            onChange={(e) => setNumRecurrences(e.target.value)}
                          />
                        )}
                      </Grid>
                    </Grid.Container>
                  </Grid>
                )}
              </Grid.Container>
            </>
          )}

          {/* Details Mode - Family Group*/}
          {!editMode && (
            <div>
              <Input
                aria-label="Family Group"
                readOnly={true}
                fullWidth
                labelLeft={"Family Group"}
                initialValue={familyGroupName}
              />
            </div>
          )}

          <Textarea
            aria-label="Description"
            minRows={3}
            maxRows={10}
            readOnly={!editMode}
            label="Description"
            initialValue={description}
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />

          <Input
            aria-label="Location"
            readOnly={!editMode}
            label={editMode ? "Location" : ""}
            labelLeft={editMode ? "" : "Location"}
            initialValue={location}
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Grid.Container direction="row">
            <Grid xs={3}>
              {isCreationUser && !recurring && (
                <Button
                  auto
                  flat
                  color="error"
                  onPress={() => {
                    deleteEvent(props);
                  }}
                >
                  Delete
                </Button>
              )}

              {isCreationUser && recurring && (
                <DeleteRecurrence eventProps={props} eventName={title} />
              )}
            </Grid>

            <Grid xs={6}></Grid>

            <Grid xs={3} justify="right">
              {!recurring && isCreationUser && (
                <Button
                  auto
                  flat
                  color="default"
                  onPress={() => {
                    if (editMode) {
                      submitUpdateSingleEventForm(props);
                    } else {
                      setEditMode(true);
                    }
                  }}
                >
                  {editMode ? "Save" : "Edit"}
                </Button>
              )}

              {recurring && isCreationUser && (
                <>
                  {!editSingleMode && (
                    <Button
                      auto
                      flat
                      color="default"
                      onPress={() => {
                        if (editRecurringMode) {
                          submitUpdateRecurrenceForm(props);
                        } else {
                          setEditMode(true);
                          setEditRecurringMode(true);
                        }
                      }}
                    >
                      {editRecurringMode ? "Save series" : "Edit this series"}
                    </Button>
                  )}

                  {!editRecurringMode && (
                    <Button
                      auto
                      flat
                      color="default"
                      onPress={() => {
                        if (editMode) {
                          submitUpdateSingleEventForm(props);
                        } else {
                          setEditMode(true);
                          setEditSingleMode(true);
                        }
                      }}
                    >
                      {editSingleMode ? "Save event" : "Edit this event"}
                    </Button>
                  )}
                </>
              )}

              {editMode && (
                <Button
                  auto
                  flat
                  color="error"
                  onPress={() => {
                    resetEventDetails();
                  }}
                >
                  Cancel
                </Button>
              )}

              <Button
                auto
                flat
                color="error"
                onPress={() => {
                  props.setVisible(false);
                  setEditMode(false);
                  setEditRecurringMode(false);
                  setEditSingleMode(false);
                  props.clearGroupName();
                }}
              >
                Close
              </Button>
            </Grid>
            {editRecurringMode
              ? "NOTE: updating a series will overwrite ALL existing events in the series, including past and future events."
              : ""}
          </Grid.Container>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewEvent;
