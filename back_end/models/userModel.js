const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email required."],
    unique: true
  },
  firstName: {
    type: String,
    required: [true, "First name is required."],
    minLength: [1, "First name must have at least one character."]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required."],
    minLength: [1, "Last name must have at least one character."]
  },
  birthday: {
    type: Date, 
    required: [true, "A user must have a birthday."]
  },
  nickname: {
    type: String,
    required: [false]
  },
  pronouns: {
    type: String, 
    required: [false]
  },
  displayEmail: {
    type: String,
    required: [false]
  },
  address: {
    type: String,
    required: [false]
  },
  cellNumber: {
    type: Number,
    required: [false]
  },
  homeNumber: {
    type: Number,
    required: [false]
  },
  timestamps: true // adds createdAt and updatedAt Date fields
});

const User = mongoose.model("User", userSchema);
// const TestUsers = mongoose.model("TestUsers", userSchema);
module.exports = User;
