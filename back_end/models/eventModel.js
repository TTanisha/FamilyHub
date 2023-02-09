const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String, 
    required: [true, "The event must have a name."]
  },
  creationUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "The event must be created by a user."]
  },
  extraInfo: {
    type: String,
    required: [false]
  },
  recurring: {
    type: Boolean, 
    required: [true, "The event must specify if it is a one-time or recurring."]
  },
  tags: [{
    type: String,
    required: [false],
    timestamps: true
  }],
  timestamps: true // adds createdAt and updatedAt Date fields
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
