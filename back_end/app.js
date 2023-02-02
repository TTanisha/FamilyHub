const express = require("express");
const cors = require("cors");
const app = express();

//Get Routes
const userRouter = require("./routes/userRoutes");


app.use(cors());

// define routes and API

//app.use("/FamilyHub/users", userRouter)  or  app.use("/api/users", userRouter)
//app.use("/FamilyHub/family", familyRouter)  or  app.use("/api/family", familyRouter)


module.exports = app;
