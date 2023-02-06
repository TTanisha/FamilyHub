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
    <div class="container">
      <div class="filters-container"></div>
      <div>
        <span class="calendar-navi">
          <button class="prev-button" type="button">
            <FaArrowLeft />
          </button>
          <div class="calendar-center-header">
            <div id="renderRange" class="calendar-title">January</div>
            <button type="button" class="select-date">
              <FaRegCaretSquareDown />
            </button>
            <button type="button" class="today-button">Today</button>
          </div>
          <button type="button" class="next-button">
            <FaArrowRight />
          </button>
        </span>
        <div id="calendar" class="calendar"></div>
      </div>
      <div class="schedule-container"></div>
      <div class="event-buttons-container"></div>
    </div>
  );
};

export default Calendar;