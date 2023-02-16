const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email required."],
    unique: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: [true, "Password required."]
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
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyGroup',
    required: [false]
  }]
});

const User = mongoose.model("User", userSchema);
const TestUser = mongoose.model("TestUser", userSchema);

module.exports = TestUser;
