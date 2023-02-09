const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, "The family group must have a name."]
  },
  members: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "The group must have a user."]
  }
});

const FamilyGroup = mongoose.model("FamilyGroup", groupSchema);
const TestFamilyGroup = mongoose.model("TestFamilyGroup", groupSchema);

module.exports = {FamilyGroup, TestFamilyGroup};
