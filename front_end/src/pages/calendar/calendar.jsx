import React, {useState, useEffect} from 'react';
import TUICalendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import './calendar.css';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import moment from 'moment';
import CreateEventForm from '../../components/calendar/createEventForm';
import axios from 'axios';
import ViewEvent from '../../components/calendar/viewEvent';
import {Text, Grid, Spacer, Dropdown, Button} from "@nextui-org/react";
import { Calendar as ReactCalendar } from 'react-calendar';
import FilterSelector from '../../components/calendar/filterSelector';

let tuiCalendar = new TUICalendar('#calendar');

function createCalendar() {
  tuiCalendar = new TUICalendar('#calendar', {
    defaultView: 'month',
    useFormPopup: false,
    useCreationPopup: false,
    useDetailPopup: false,
    taskView: false,
    isReadOnly: true,
  });
  return tuiCalendar;
}

function setCalendarTitle(view) {
  let string;
  
  if(view == 'Monthly') {
    string = moment(tuiCalendar.getDate().toString(), "ddd MMM DD YYYY HH:mm:ss").format("MMMM YYYY");
  } else if (view == 'Daily') {
    string = moment(tuiCalendar.getDate().toString(), "ddd MMM DD YYYY HH:mm:ss").format("ddd MMMM DD YYYY");
  } else if (view == 'Weekly') {
    let weekStart = moment(tuiCalendar.getDateRangeStart().toString(), "ddd MMM DD YYYY HH:mm:ss").format("ddd MMMM DD YYYY");
    let weekEnd = moment(tuiCalendar.getDateRangeEnd().toString(), "ddd MMM DD YYYY HH:mm:ss").format("ddd MMMM DD YYYY");
    string = weekStart + " - " + weekEnd;
  }

  document.getElementById("renderRange").innerHTML = string;
}



const Calendar = () => {
  let currUser = JSON.parse(localStorage.getItem("user"));
  
  const [usersEvents, setUsersEvents] = useState([]);
  const [tuiCalendarEvents, setTUICalendarEvents] = useState([]);
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({});
  const [selectedFamilyGroupName, setSelectedFamilyGroupName] = useState();
  const [selectedView, setSelectedView] = useState("Monthly");
  const [pickerDate, setPickerDate] = useState();
  const [selectedFilters, setSelectedFilters] = useState(currUser.groups);

  useEffect(() => {
    createCalendar();
    setCalendarTitle("Monthly");
    setPickerDate(tuiCalendar.getDate().toDate());
    bindEventHandlers();
  }, []);

  function renderTUICalendarEvents(tuiCalendarEvents) {
    tuiCalendar.clear();
    tuiCalendar.createEvents(tuiCalendarEvents);
    setFilterVisibility();
    tuiCalendar.render();
  }

  function handleSetCalendarTitle() {
    if(selectedView != "Monthly") {
      setCalendarTitle(selectedView.currentKey);
    } else {
      setCalendarTitle("Monthly");
    }
  }

  function navigateCalendar(option) {
    if(option == 1) {
      tuiCalendar.next();
    } else if (option == -1) {
      tuiCalendar.prev();
    } else if (option == 0) {
      tuiCalendar.today();
    }
  
    handleSetCalendarTitle();
    tuiCalendar.getStoreDispatchers().popup.hideSeeMorePopup();
    tuiCalendar.render();
  }

  useEffect(() => {
    if(pickerDate) {
      tuiCalendar.setDate(pickerDate);
      handleSetCalendarTitle(); 
      tuiCalendar.render();
    }
  }, [pickerDate])
   

  useEffect(() => {
    if(selectedView != 'Monthly') {
      if(selectedView.currentKey == 'Monthly') {
        tuiCalendar.changeView('month');
      } else if(selectedView.currentKey == 'Daily') {
        tuiCalendar.changeView('day');
        tuiCalendar.setOptions({
          week: {
            taskView: false,
          }
        })
      } else if(selectedView.currentKey == 'Weekly') {
        tuiCalendar.changeView('week');
        tuiCalendar.setOptions({
          week: {
            taskView: false,
          }
        })
      }
      setCalendarTitle(selectedView.currentKey);
    } 
    
    tuiCalendar.render();
  }, [selectedView])

  useEffect(() => {
    renderTUICalendarEvents(tuiCalendarEvents);
  }, [tuiCalendarEvents]);

  useEffect(() => {
    if(data) {
      usersEvents?.map((event) => {
        let category = event.isAllDay ? 'allday' : 'time';

        let tuiEvent = {
          id: event._id,
          calendarId: event.familyGroup,
          title: event.title,
          body: event.body,
          category: category,
          start: event.start,
          end: event.end,
          isAllDay: event.isAllDay,
          location: event.location,
          raw: {
            creationUser: event.creationUser,
            recurrenceId: event.recurrenceId,
            recurrenceRule: event.recurrenceRule,
            recurrenceNum: event.recurrenceNum
          }
        };
        setTUICalendarEvents(tuiCalendarEvents => [...tuiCalendarEvents, tuiEvent]);
      });
    }
  }, [data]);

  function bindEventHandlers() {
    tuiCalendar.on({
      clickMoreEventsBtn: function (btnInfo) {
        tuiCalendar.getStoreDispatchers().popup.hideAllPopup();
        tuiCalendar.clearGridSelections();
      },
      clickEvent: function (eventInfo) {
        setClickedEvent(eventInfo);
        getFamilyGroupName(eventInfo.event.calendarId);
        setVisible(true);
      },
    });
  }

  async function getFamilyGroupName(groupId) {
    let res = Promise.resolve(
    await axios.post("http://localhost:8080/api/familyGroups/getFamilyGroup", {groupId: groupId})
      .then(function(response)
      {
          if(response.data.status === "success")
          {       
            setSelectedFamilyGroupName(response.data.data.group.groupName);
          }
      })
      .catch(function (error) {
        if(error.message!='canceled') {
          console.log(error)
        }})
    );

    return res;
  }
    
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

  useEffect(() => {
    setFilterVisibility();
  }, [selectedFilters])

  function updateEvents() {
    const controller = new AbortController();
    setUsersEvents([]);
    setTUICalendarEvents([]);
    tuiCalendar.clear();
    getUsersEvents(controller);

    return () => controller.abort();
  }

  function setFilterVisibility() {
    currUser.groups?.map((groupId) => {
      tuiCalendar.setCalendarVisibility(groupId, false);
    });

    selectedFilters.map((calendarId) => {
      tuiCalendar.setCalendarVisibility(calendarId, true);
    });

    tuiCalendar.render();
  }

  function clearGroupName() {
    setSelectedFamilyGroupName(null);
  }

  function setFilter(selected) {
    setSelectedFilters(selected);
  }

  return (
    <div className="container">
      <div className="filters-container">
      
        <Grid.Container justify='center' direction='column'>

            <Text h4> Select View: </Text>  
            <Dropdown>
              <Dropdown.Button flat>{selectedView}</Dropdown.Button>
              <Dropdown.Menu 
                aria-label="Static Actions" 
                disallowEmptySelection
                selectionMode="single"
                defaultSelectedKeys={"monthly"}
                selectedKeys={selectedView}
                onSelectionChange={setSelectedView}
              >
                <Dropdown.Item key="Monthly">Monthly</Dropdown.Item>
                <Dropdown.Item key="Weekly">Weekly</Dropdown.Item>
                <Dropdown.Item key="Daily">Daily</Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>
            <Spacer/>
            <div className="datePicker">
              <ReactCalendar
                onChange={(date) => setPickerDate(date)}  value={pickerDate} calendarType="Hebrew"
              />
            </div>
            <FilterSelector setFilter={setFilter}/>
        </Grid.Container> 
        
      </div>
      <div>
        <span className="calendar-navi">
          <Button color="primary" flat onClick={()=>navigateCalendar((-1))} icon={<FaArrowLeft />}/>
          <div className="calendar-center-header">
            <div id="renderRange" className="calendar-title"></div>
            <Button color="primary" flat auto onClick={()=>navigateCalendar(0)}>Today</Button>
          </div>
          <Button color="primary" flat onClick={()=>navigateCalendar(1)} icon={<FaArrowRight />}/>
        </span>
        <div id="calendar" className="calendar"></div>
        { selectedFamilyGroupName ? 
          <ViewEvent 
            visible={visible} 
            setVisible={setVisible} 
            eventInfo={clickedEvent} 
            groupName={selectedFamilyGroupName}
            clearGroupName={() => clearGroupName()}
            updateEvents={updateEvents} 
        />  : ''}
      </div>
      <div className="schedule-container"></div>
      <div className="event-buttons-container">
        <CreateEventForm updateEvents={updateEvents}/>
      </div>
    </div>
  );
};

export default Calendar;