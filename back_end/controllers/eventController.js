const mongoose = require("mongoose");
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

exports.createRecurringEvent = async function (event) {
  
  var {
    title,
    body,
    creationUser,
    isAllDay,
    start,
    end,
    location,
    recurrenceRule,
    recurrenceNum,
    recurrenceId,
    tags,
    familyGroup,
  } = event;

  var newEvent;

  recurrenceId = mongoose.Types.ObjectId();

  for (let i = 0; i < recurrenceNum; i++) {
    var initialStartDate = new Date(start);
    var initialEndDate = new Date(end);

    var startDate = new Date(initialStartDate);
    var endDate = new Date(initialEndDate);

    if (recurrenceRule === "DAILY") {
      startDate.setDate(initialStartDate.getDate() + i);
      endDate.setDate(initialEndDate.getDate() + i);
    } else if (recurrenceRule === "WEEKLY") {
      startDate.setDate(initialStartDate.getDate() + i * 7);
      endDate.setDate(initialEndDate.getDate() + i * 7);
    } else if (recurrenceRule === "MONTHLY") {
      startDate.setMonth(initialStartDate.getMonth() + i);
      endDate.setMonth(initialEndDate.getMonth() + i);
    } else if (recurrenceRule === "YEARLY") {
      startDate.setFullYear(initialStartDate.getFullYear() + i);
      endDate.setFullYear(initialEndDate.getFullYear() + i);
    }

    newEvent = await Events.create({
      title: title,
      body: body,
      creationUser: creationUser,
      isAllDay: isAllDay,
      start: startDate,
      end: endDate,
      location: location,
      recurrenceRule: recurrenceRule,
      recurrenceNum: recurrenceNum,
      recurrenceId: recurrenceId,
      tags: tags,
      familyGroup: familyGroup,
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
};

exports.createEvent = async (req, res) => {
  try {
    this.validateEventDates(req.body);

    //handle recurrence
    if (req.body.recurrenceRule !== "ONCE") {
      await this.createRecurringEvent(req.body);

      res.status(201).send({
        // created successfully
        status: "success",
        message: "New recurring event created",
      });
    } else {
      const newEvent = await Events.create(req.body);

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
    await Events.deleteMany({ recurrenceId: req.body.recurrenceId });

    //recreate updated recurrence
    this.validateEventDates(req.body);

    //handle recurrence
    if (req.body.recurrenceRule !== "ONCE") {
      await this.createRecurringEvent(req.body);

      res.status(201).send({
        // created successfully
        status: "success",
        message: "New recurring event created",
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

exports.deleteRecurrence = async (req, res) => {
  try {
    //delete all events in recurrence
    await Events.deleteMany({ recurrenceId: req.body.recurrenceId });

    res.status(200).send({
      // everything is OK
      status: "success",
      message: "Recurrence deleted",
    });
  } catch (err) {
    res.status(400).send({
      // bad request
      status: "fail",
      message: err.message,
      description: "Failed to delete the recurrence",
    });
  }
};
