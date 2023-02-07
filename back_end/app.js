const express = require("express");
const cors = require("cors");
const app = express();

//Get Routes
const userRouter = require("./routes/userRoutes");


app.use(cors());
// grant access to user's data from body
app.use(express.json())


// define routes and API
app.use("/api/users", userRouter);
//app.use("/FamilyHub/family", familyRouter)  or  app.use("/api/family", familyRouter)


module.exports = app;
