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
  },
  timestamps: [true] // adds createdAt and updatedAt Date fields
});

const FamilyGroup = mongoose.model("Family Group", groupSchema);
const TestFamilyGroup = mongoose.model("Test Family Group", groupSchema);

module.exports = {FamilyGroup, TestFamilyGroup};
