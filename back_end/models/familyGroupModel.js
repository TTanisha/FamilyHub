const mongoose = require("mongoose");

// mongoDB schema
const familyGroupSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: [true, "A family group must have groupName"],
        minLength: [1, "Family group name must have at least one character."]
    },
    groupMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [false]
    }]
});

const FamilyGroups = mongoose.model("FamilyGroups", familyGroupSchema);
module.exports = FamilyGroups;