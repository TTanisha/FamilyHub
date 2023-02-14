const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { // event name
    type: String, 
    required: [true, "The event must have a name."]
  },
  body: { // event description 
    type: String,
    required: [false]
  },
  creationUser: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "The event must be created by a user."]
  },
  isAllDay: { // whether the event is all day or not
    type: Boolean,
    required: [true, "Must specify if the event is a full day event."]
  },
  start: { // start time of the event 
    type: Date,
    required: [true, "The event must have a start date."]
  },
  end: { // end time of the event 
    type: Date,
    required: [true, "The event must have an end date."]
  },
  location: { // location of the event 
    type: String, 
    required: [false]
  },
  recurrenceRule: {
    type: String, 
    enum: ["ONCE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
    required: [true, "The event must specify if it is a one-time or recurring."]
  },
  tags: [{
    type: String,
    required: [false],
    minlength: [1, "The tag must have at least one character."]
  }],
  familyGroup: { // calendarId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyGroup',
    required: [false, "The event must belong to a family group."]
  } // TODO: can we have personal events not associated with group? 
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;