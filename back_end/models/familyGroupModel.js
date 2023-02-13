const mongoose = require("mongoose");

// mongoDB schema
const familyGroupSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: [true, "A family group must have groupName"],
    },
    groupMembers: {
        type: Array, 
        required: [false],
    }
});

const FamilyGroups = mongoose.model("FamilyGroups", familyGroupSchema);
module.exports = FamilyGroups;