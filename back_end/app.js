const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//Get Routes
const userRouter = require("./routes/userRoutes");
const familyGroup = require("./routes/familyGroupRoutes");
const eventRouter = require("./routes/eventRoutes");

app.use(cors());
// grant access to user's data from body
app.use(express.json());

// define routes and API
app.use("/api/users", userRouter);
app.use("/api/familyGroups", familyGroup);
app.use("/api/events", eventRouter);

module.exports = app;
