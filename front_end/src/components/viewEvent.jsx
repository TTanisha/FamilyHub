import React, { useState } from 'react';
import axios from 'axios';
import {Text, Modal, Textarea, Button, Card, Spacer, Input} from "@nextui-org/react";

const ViewEvent = (props) => {
  const currEvent = props.eventInfo.event;

  const startDateObject = currEvent?.start.d;
  const startYear = startDateObject?.getFullYear();
  const startMonth = startDateObject?.getMonth();
  const startDate = startDateObject?.getDate();
  const startHour = startDateObject?.getHours();
  const startMinutes = startDateObject?.getMinutes();

  const endDateObject = currEvent?.end.d;
  const endYear = endDateObject?.getFullYear();
  const endMonth = endDateObject?.getMonth();
  const endDate = endDateObject?.getDate();
  const endHour = endDateObject?.getHours();
  const endMinutes = endDateObject?.getMinutes();
  
    return (
    <div>
      <Modal
        open={props.visible}
        onClose={()=>props.setVisible(false)}
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Modal.Header>
          <Text id="modal-title" size={20}>
            {props.eventInfo.event?.title}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            aria-label="Event Title"
            readOnly
            labelLeft="Event Title"
            initialValue={props.eventInfo.event?.title}
          />
          <Input 
            aria-label="Date"
            readOnly 
            required 
            labelLeft='Date' 
            type='date' 
            initialValue={startYear + "-" + (startMonth<10 ? "0" : "") + startMonth  + "-" + (startDate<10 ? "0" : "") + startDate} 
          />
          <Input 
            aria-label="Start Time"
            readOnly 
            required 
            labelLeft='Start Time' 
            type='time' 
            initialValue={(startHour<10? "0" : "") + startHour + ":" + (startMinutes<10 ? "0" : "") + startMinutes} 
          />
          <Input 
            aria-label="End Time"
            readOnly 
            required 
            labelLeft='End Time' 
            type='time' 
            initialValue={(endHour<10? "0" : "") + endHour + ":" + (endMinutes<10 ? "0" : "") + endMinutes} 
          />
          <Input 
            aria-label="Description"
            readOnly 
            required 
            labelLeft='Description' 
            initialValue={currEvent?.body}
          />
          <Input 
            aria-label="Location"
            readOnly 
            labelLeft='Location' 
            initialValue={currEvent?.location}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={() => props.setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

    )
}

export default ViewEvent;