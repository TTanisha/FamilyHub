import React, {useState, useEffect} from 'react';
import TUICalendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import './calendar.css';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import moment from 'moment';
import CreateEventForm from '../../components/createEventForm';
import axios from 'axios';

let tuiCalendar = new TUICalendar('#calendar', {
  defaultView: 'month',
  isReadOnly: true
});

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

function renderTUICalendarEvents(tuiCalendarEvents) {
  tuiCalendar.clear();
  tuiCalendar.createEvents(tuiCalendarEvents);
}

const Calendar = () => {
  let currUser = JSON.parse(localStorage.getItem("user"));
  
  const [usersEvents, setUsersEvents] = useState([]);
  const [tuiCalendarEvents, setTUICalendarEvents] = useState([]);
  const [data, setData] = useState(null);
  

  useEffect(() => {
    createCalendar();
    setCalendarTitle();
  }, []);

  useEffect(() => {
    renderTUICalendarEvents(tuiCalendarEvents);
  }, [tuiCalendarEvents]);

  useEffect(() => {
    if(data) {
      usersEvents?.map((event) => {
        let tuiEvent = {
          id: event._id,
          calendarId: event.familyGroup,
          title: event.title,
          category: 'time',
          start: event.start,
          end: event.end,
          isAllDay: false,
        };
        setTUICalendarEvents(tuiCalendarEvents => [...tuiCalendarEvents, tuiEvent]);
      });
    }
  }, [data]);

  async function getUsersEvents(controller) {
      const promises = await Promise.all(currUser.groups?.map(async (id) => {
      return await axios.post("http://localhost:8080/api/familyGroups/getFamilyGroupEvents", 
      {
        groupId: id
      }, {signal: controller.signal })
      .then(function(response)
      {
          if(response.data.status === "success")
          {
            const groupEvents = response.data.data.groupEvents; 

            groupEvents?.map((event) => {
              setUsersEvents(usersEvents => [...usersEvents, event])
            })
          }
      }).catch(function (error) {
      })
    } 
    ) );

    const promise = await Promise.all(promises);
    setUsersEvents(usersEvents => [...usersEvents]);
    setData(promise);
  }

 useEffect(() => {
    const controller = new AbortController();

    getUsersEvents(controller);

    return () => controller.abort();
  }, []);

  const updateEvents = () => {
    const controller = new AbortController();
    setUsersEvents([]);
    setTUICalendarEvents([]);
    tuiCalendar.clear();
    getUsersEvents(controller);

    return () => controller.abort();
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
        <CreateEventForm updateEvents={updateEvents}/>
      </div>
    </div>
  );
};

export default Calendar;