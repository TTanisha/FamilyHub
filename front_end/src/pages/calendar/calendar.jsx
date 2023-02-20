import React from 'react';
import TUICalendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { useEffect } from 'react';
import './calendar.css';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import moment from 'moment';
import { Modal, useModal, Button, Text, Input } from "@nextui-org/react";
import CreateEventForm from '../../components/createEventForm';

let tuiCalendar = new TUICalendar('#calendar', {
  defaultView: 'month',
  isReadOnly: true
});

let events = [
  {
    id: '1',
    calendarId: '1',
    title: 'Valentines Day',
    category: 'allday',
    start: '2023-02-14T22:30:00+09:00',
    end: '2023-02-14T22:30:00+09:00',
    isAllDay: true,
  }
];

let currDate = new Date();

function createCalendar() {
  tuiCalendar = new TUICalendar('#calendar', {
    defaultView: 'month',
    isReadOnly: true
  });
  return tuiCalendar;
}

function getNext() {
  tuiCalendar.next();

  currDate.setMonth(currDate.getMonth() + 1);
  tuiCalendar.setDate(currDate);
  setCalendarTitle();

  tuiCalendar.render();
}

function getPrev() {
  tuiCalendar.prev();

  currDate.setMonth(currDate.getMonth() - 1);
  tuiCalendar.setDate(currDate);
  setCalendarTitle();

  tuiCalendar.render();
}

function getToday() {
  tuiCalendar.today();

  currDate = new Date();
  setCalendarTitle();

  tuiCalendar.render();
}

function setCalendarTitle() {
  let string = moment(tuiCalendar.getDate().toString()).format("MMMM YYYY");
  document.getElementById("renderRange").innerHTML = string;
}

function setCalendarEvents() {
  tuiCalendar.createEvents(events);

  tuiCalendar.render();
}

const Calendar = () => {

  useEffect(() => {
    createCalendar();
    setCalendarTitle();
    setCalendarEvents();
  });

  const reRenderCalendar = () => {
    tuiCalendar.render();
  }

  return (
    <div className="container">
      <div className="filters-container"></div>
      <div>
        <span className="calendar-navi">
          <button className="prev-button" type="button" onClick={getPrev}>
            <FaArrowLeft />
          </button>
          <div className="calendar-center-header">
            <div id="renderRange" className="calendar-title"></div>
            <button type="button" className="today-button" onClick={getToday}>Today</button>
          </div>
          <button type="button" className="next-button" onClick={getNext}>
            <FaArrowRight />
          </button>
        </span>
        <div id="calendar" className="calendar"></div>
      </div>
      <div className="schedule-container"></div>
      <div className="event-buttons-container">
        <CreateEventForm reRenderCalendar={reRenderCalendar}/>
      </div>
    </div>
  );
};

export default Calendar;