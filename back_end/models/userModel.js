const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email required."],
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: [true, "Password required."],
    minLength: [6, "Password must be at least six characters."]
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
    ref: 'FamilyGroups',
    required: [false]
  }]
});

const User = mongoose.model("User", userSchema, collection = "Users");

module.exports = User;
