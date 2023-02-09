const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String, 
    required: [true, "The event must have a name."]
  },
  eventDescription: {
    type: String,
    required: [false]
  },
  creationUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "The event must be created by a user."]
  },
  startDate: {
    type: Date,
    required: [true, "The event must have a start date."]
  },
  endDate: {
    type: Date,
    required: [true, "The event must have an end date."]
  },
  fullDay: {
    type: Boolean,
    required: [true, "Must specify if the event is a full day event."]
  },
  recurrence: {
    type: String, 
    enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
    required: [true, "The event must specify if it is a one-time or recurring."]
  },
  familyGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyGroup',
    required: [true, "The event must belong to a family group."]
  },
  tags: [{
    type: String,
    required: [false],
    minlength: [1, "The tag must have at least one character."],
    timestamps: [true]
  }],
  timestamps: [true] // adds createdAt and updatedAt Date fields
});

const Event = mongoose.model("Event", eventSchema);
const TestEvent = mongoose.model("TestEvent", eventSchema);

module.exports = {Event, TestEvent};
