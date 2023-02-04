import React from 'react';
import TUICalendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { useEffect } from 'react';

const Calendar = () => {    
    useEffect(() => {
        const calendar = new TUICalendar('#calendar', {
            defaultView: 'month'});
    }, [])

  return (
    <div>
      <div id="calendar"  style={{height: 800, width: 1000}}></div>
    </div>
  );
};
  
export default Calendar;