const mongoose = require("mongoose");

// mongoDB schema
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "A user must have FirstName"],
    },
    lastName: {
        type: String,
        required: [true, "A user must have lastName"],
    },
    eMail: {
        type: String,
        required: [true, "A user must have Email"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "A user must have username"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "A user must have password"],
    },
    birthday: {
        type: String,
        required: [true, "A user must have birthday"],
    },
});


const Users = mongoose.model("Users", userSchema);
module.exports = Users;