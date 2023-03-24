const Events = require("../models/eventModel");
const FamilyGroups = require("../models/familyGroupModel");

exports.validateEventDates = function (event) {
  if (event.start !== null && event.end !== null) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    if (end < start) {
      throw new Error((message = "Start date must be before end date."));
    } else {
      return true;
    }
  }
};

exports.createEvent = async (req, res) => {
  var mongoose = require('mongoose');

  try {
    this.validateEventDates(req.body);
    var { title, body, creationUser, isAllDay, 
      start, end, location, recurrenceRule, 
      recurrenceNum, recurrenceId, tags, familyGroup } = req.body;

      var initialStartDate = new Date(start); 
      var initialEndDate = new Date(end);
      
      var startDate = new Date(initialStartDate);
      var endDate = new Date(initialEndDate);

      var newEvent;

    //handle recurrence 
    if(req.body.recurrenceRule != "ONCE") {
      recurrenceId = mongoose.Types.ObjectId();

      for(let i = 0; i < recurrenceNum; i++)
      {
        if(recurrenceRule === "DAILY")
        {
          startDate.setUTCDate(initialStartDate.getDate()+i);
          endDate.setUTCDate(initialEndDate.getDate()+i);
        }
        else if (recurrenceRule === 'MONTHLY')
        {
          startDate.setUTCMonth(initialStartDate.getUTCMonth()+i);
          endDate.setUTCMonth(initialEndDate.getUTCMonth()+i);
        }
        else if (recurrenceRule === 'YEARLY')
        {
          startDate.setUTCFullYear(initialStartDate.getFullYear()+i);
          endDate.setUTCFullYear(initialEndDate.getFullYear()+i);
        }

        newEvent = await Events.create(
          {"title": title, 
            "body": body, 
            "creationUser": creationUser, 
            "isAllDay": isAllDay, 
            "start": startDate, 
            "end": endDate,
            "location": location, 
            "recurrenceRule": recurrenceRule, 
            "recurrenceNum": recurrenceNum - (i+1),
            "recurrenceId": recurrenceId, 
            "tags": tags,
            "familyGroup": familyGroup
          });

        await FamilyGroups.updateOne(
          { _id: newEvent.familyGroup },
          {
            $addToSet: {
              events: newEvent,
            },
          },
        );
      }

      res.status(201).send({
        // created successfully
        status: "success",
        message: "New recurring event created",
        data: { newEvent },
      });
    } else {

      newEvent = await Events.create(
        {"title": title, 
          "body": body, 
          "creationUser": creationUser, 
          "isAllDay": isAllDay, 
          "start": startDate, 
          "end": endDate,
          "location": location, 
          "recurrenceRule": recurrenceRule, 
          "tags": tags,
          "familyGroup": familyGroup
        });

      await FamilyGroups.updateOne(
        { _id: newEvent.familyGroup },
        {
          $addToSet: {
            events: newEvent,
          },
        },
      );

      res.status(201).send({
        // created successfully
        status: "success",
        message: "New event created",
        data: { newEvent },
      });
    }

  } catch (err) {
    res.status(400).send({
      // bad request
      status: "fail",
      message: err.message,
      description: "Failed to create a new event",
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const events = await Events.findById(req.body.id);
    if (!events) {
      throw new Error((message = "Event not found"));
    } else {
      res.status(200).send({
        // everything is OK
        status: "success",
        message: "Event found",
        data: { events },
      });
    }
  } catch (err) {
    res.status(400).send({
      // bad request
      status: "fail",
      message: err.message,
      description: "Failed to find the event",
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    let events = await Events.find(req.body);
    if (events.length > 0) {
      res.status(200).send({
        // everything is OK
        status: "success",
        message: "Events found",
        data: { events },
      });
    } else {
      throw new Error((message = "No events found"));
    }
  } catch (err) {
    res.status(400).send({
      // bad request
      status: "fail",
      message: err.message,
      description: "Failed to find any events",
      data: { events: [] },
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    let eventToUpdate = await Events.findById(req.body.id);
    if (!eventToUpdate) {
      throw new Error((message = "Event not found"));
    }
    if (req.body.creationUser == eventToUpdate.creationUser) {
      this.validateEventDates(req.body);
      eventToUpdate = await Events.findByIdAndUpdate(
        req.body.id,
        { $set: req.body },
        { new: true, runValidators: true },
      );

      res.status(200).send({
        // everything is OK
        status: "success",
        message: "Event updated",
        data: { eventToUpdate },
      });
    } else {
      // invalid user permissions
      throw new Error((message = "Invalid user permissions"));
    }
  } catch (err) {
    res.status(400).send({
      // bad request
      status: "fail",
      message: err.message,
      description: "Failed to update the event",
    });
  }
};

exports.updateRecurrence = async (req, res) => {
  try {
    //delete all events in recurrence
    await Events.deleteMany({recurrenceId: req.body.recurrenceId});

    //recreate updated recurrence
    var mongoose = require('mongoose');


      this.validateEventDates(req.body);
      var { title, body, creationUser, isAllDay, 
        start, end, location, recurrenceRule, 
        recurrenceNum, recurrenceId, tags, familyGroup } = req.body;
  
        var initialStartDate = new Date(start); 
        var initialEndDate = new Date(end);
        
        var startDate = new Date(initialStartDate);
        var endDate = new Date(initialEndDate);
  
        var newEvent;
  
      //handle recurrence 
      if(req.body.recurrenceRule != "ONCE") {
        recurrenceId = mongoose.Types.ObjectId();
  
        for(let i = 0; i < recurrenceNum; i++)
        {
          if(recurrenceRule === "DAILY")
          {
            startDate.setUTCDate(initialStartDate.getDate()+i);
            endDate.setUTCDate(initialEndDate.getDate()+i);
          }
          else if (recurrenceRule === 'MONTHLY')
          {
            startDate.setUTCMonth(initialStartDate.getUTCMonth()+i);
            endDate.setUTCMonth(initialEndDate.getUTCMonth()+i);
          }
          else if (recurrenceRule === 'YEARLY')
          {
            startDate.setUTCFullYear(initialStartDate.getFullYear()+i);
            endDate.setUTCFullYear(initialEndDate.getFullYear()+i);
          }
  
          newEvent = await Events.create(
            {"title": title, 
              "body": body, 
              "creationUser": creationUser, 
              "isAllDay": isAllDay, 
              "start": startDate, 
              "end": endDate,
              "location": location, 
              "recurrenceRule": recurrenceRule, 
              "recurrenceNum": recurrenceNum - (i+1),
              "recurrenceId": recurrenceId, 
              "tags": tags,
              "familyGroup": familyGroup
            });
  
          await FamilyGroups.updateOne(
            { _id: newEvent.familyGroup },
            {
              $addToSet: {
                events: newEvent,
              },
            },
          );
        }
  
        res.status(201).send({
          // created successfully
          status: "success",
          message: "New recurring event created",
          data: { newEvent },
        });
      } else {
  
        newEvent = await Events.create(
          {"title": title, 
            "body": body, 
            "creationUser": creationUser, 
            "isAllDay": isAllDay, 
            "start": startDate, 
            "end": endDate,
            "location": location, 
            "recurrenceRule": recurrenceRule, 
            "tags": tags,
            "familyGroup": familyGroup
          });
  
        await FamilyGroups.updateOne(
          { _id: newEvent.familyGroup },
          {
            $addToSet: {
              events: newEvent,
            },
          },
        );
  
        res.status(201).send({
          // created successfully
          status: "success",
          message: "New event created",
          data: { newEvent },
        });
      }
  
  } catch (err) {
    res.status(400).send({
      // bad request
      status: "fail",
      message: err.message,
      description: "Failed to create a new event",
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    let eventToDelete = await Events.findById(req.body.id);
    if (!eventToDelete) {
      throw new Error((message = "Event not found"));
    }
    if (req.body.creationUser == eventToDelete.creationUser) {
      eventToDelete = await Events.findByIdAndDelete(req.body.id);
      res.status(200).send({
        // everything is OK
        status: "success",
        message: "Event deleted",
        data: { eventToDelete },
      });
    } else {
      // invalid user permissions
      throw new Error((message = "Invalid User Permissions"));
    }
  } catch (err) {
    res.status(400).send({
      // bad request
      status: "fail",
      message: err.message,
      description: "Failed to delete the event",
    });
  }
};
