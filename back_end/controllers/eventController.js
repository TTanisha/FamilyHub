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
  } else {
    throw new Error((message = "Date values cannot be null."));
  }
};

exports.createEvent = async (req, res) => {
  try {
    this.validateEventDates(req.body);
    const newEvent = await Events.create(req.body);
    res.status(201).send({
      // created successfully
      status: "success",
      message: "New event created",
      data: { newEvent },
    });

    await FamilyGroups.updateOne(
      { _id: newEvent.familyGroup },
      {
        $addToSet: {
          events: newEvent,
        },
      },
    );
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
