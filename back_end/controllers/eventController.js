const Events = require("../models/eventModel");
const FamilyGroups = require("../models/familyGroupModel");

exports.validateEventDates = function(event) {
  if (event.start !== null && event.end !== null) {
    if (event.end.toISOString() < event.start.toISOString()) {
      throw "Start date must be before end date.";
    } 
    else {
      return true;
    }
  };
};

exports.createEvent = async(req, res) => {
  console.log("REQUEST: " + req.title);
  try {
    this.validateEventDates(req);
    const newEvent = await Events.create(req);
    if (newEvent === null) {
      throw err;
    } else {
      res.status(201).json({ // created successfully 
        status: "success",
        message: "New event created",
        data: {newEvent}
      });

      await FamilyGroups.updateOne({ _id: newEvent.familyGroup },
        {
            $addToSet: {
                events: newEvent,
            },
        });
    };
    
  } catch (err) {
    console.log("FAIL: " + err.message);
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to create a new event",
    });
  };
};

exports.getEventById = async(req, res) => {
  try {
    const events = await Events.findById(req.body.id);
    if (events == null) {
      throw err;
    } else {
      res.status(200).json({ // everything is OK
        status: "success",
        message: "Event found",
        data: {events}
      });
    };
  } catch (err) {
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to find the event",
    });
  };
};

exports.getEvents = async(req, res) => {
  try {
    const events = await Events.find(req.body);
    if (events == null) {
      throw err;
    } else {
      res.status(200).json({ // everything is OK
        status: "success",
        message: "Events found",
        data: {events}
      });
    };
  } catch (err) {
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to find any events",
    });
  };
};

exports.updateEvent = async(req, res) => {
  try {
    let eventToUpdate = await Events.findById(req.body.id);
    if (eventToUpdate == null) {
      throw err;
    };
    if (req.body.creationUser == eventToUpdate.creationUser) {
      eventToUpdate = await Events.findByIdAndUpdate(
        req.body.id, {$set: req.body}, {new: true, runValidators: true});
      if (eventToUpdate == null) {
        throw err;
      } else {
        res.status(200).json({ // everything is OK
          status: "success",
          message: "Event updated",
          data: {eventToUpdate}
        });
      };
    } else { // invalid user permissions 
      throw err;
    };
  } catch (err) {
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to update the event",
    });
  };
};

exports.deleteEvent = async(req, res) => {
  try {
    let eventToDelete = await Events.findById(req.body.id);
    if (eventToDelete == null) {
      throw err;
    } 
    if (req.body.creationUser == eventToDelete.creationUser) {
      eventToDelete = await Events.findByIdAndDelete(req.body.id);
      if (eventToDelete == null) {
        throw err;
      } else {
        res.status(200).json({ // everything is OK
          status: "success",
          message: "Event deleted",
          data: {eventToDelete}
        });
      };
    } else { // invalid user permissions 
      throw err;
    };
  } catch (err) {
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to delete the event",
    });
  };
};
