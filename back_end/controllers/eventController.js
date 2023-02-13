const Events = require("../models/eventModel");

exports.createEvent = async(req, res) => {
  try {
    const newEvent = await Events.create(req.body);
    if (newEvent === null) {
      throw err;
    } else {
      res.status(201).json({ // created successfully 
        status: "success",
        message: "New event created",
        data: {newEvent}
      });
    }
  } catch (err) {
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to create a new event",
    });
  };
};

exports.getEvent = async(req, res) => {

};

exports.updateEventName = async(req, res) => {

};

exports.updateEventBody = async(req, res) => {

};

exports.updateEventTime = async(req, res) => {

};

exports.updateEventLocation = async(req, res) => {

};

exports.updateEventTags = async(req, res) => {

};

exports.updateEventGroup = async(req, res) => {

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
      }
    } else { // invalid user permissions 
      throw err;
    }
  } catch (err) {
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to delete the event",
    });
  };
};
