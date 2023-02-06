import React from 'react';
import TUICalendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { useEffect } from 'react';
import './calendar.css';
import { FaArrowLeft, FaArrowRight, FaRegCaretSquareDown } from "react-icons/fa";

function createCalendar() {
  return new TUICalendar('#calendar', {
    defaultView: 'month',
    isReadOnly: true});
}

const Calendar = () => {  
  useEffect(() => {
    createCalendar();
  }, []);

  return (
    <div className="container">
      <div className="filters-container"></div>
      <div>
        <span className="calendar-navi">
          <button className="prev-button" type="button">
            <FaArrowLeft />
          </button>
          <div className="calendar-center-header">
            <div id="renderRange" className="calendar-title">January</div>
            <button type="button" className="select-date">
              <FaRegCaretSquareDown />
            </button>
            <button type="button" className="today-button">Today</button>
          </div>
          <button type="button" className="next-button">
            <FaArrowRight />
          </button>
        </span>
        <div id="calendar" className="calendar"></div>
      </div>
      <div className="schedule-container"></div>
      <div className="event-buttons-container"></div>
    </div>
  );
};

export default Calendar;