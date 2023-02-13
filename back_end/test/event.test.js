const app = require('../app');
const Events = require('../models/eventModel');
let supertest = require('supertest');
let request = supertest(app);
const mongoose = require('mongoose');
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//

const eventData = {
  title: "Test Event",
  body: "Event description",
  creationUser: new mongoose.Types.ObjectId(),
  isAllDay: false,
  start: new Date("February 17, 2023 12:00:00"), 
  end: new Date("February 17, 2023 15:00:00"),
  recurrenceRule: "ONCE"
}

beforeAll(async () => {
  // Database connection
  const DB = process.env.FAMILYHUB_DB_URI;
  mongoose.set("strictQuery", false); // Preparation for deprecation 
  const connectionOptions = {
    // Required due to changes in the MongoDB Node.js driver
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }

  mongoose.connect(DB, connectionOptions).then(
    () => {console.log("Successfully connected to MongoDB.")},
    err => {console.error("Unable to connect to MongoDB.", err.message)}
  );

  let newEvent = new Events(eventData);
  await newEvent.save();
});

//=====================================================================================//

afterAll(async () => {
  // make sure we have deleted the test events from the database
  try {
    await Events.findOneAndDelete({title: "Test Event", body: "Event description"});
  } catch (err) {
    console.log("Event not found.");
  }
  await mongoose.connection.close().then(
    () => {console.log("Successfully disconnected from MongoDB.")},
    err => {console.error("Unable to disconnect from MongoDB.", err.message)}
  );
});

//=====================================================================================//

describe("Create Event Tests", () => {

  test("Create a new event", async () => {
    const response = await request.post("/api/events/createEvent").send({
      title: "Test Event 2",
      body: "Event description",
      creationUser: new mongoose.Types.ObjectId(),
      isAllDay: true,
      start: new Date("2023-01-17"), // year,month,day
      end: new Date("2023-01-17"),
      recurrenceRule: "ONCE"
    });
    expect(response.statusCode).toBe(201);
    await Events.findOneAndDelete({title: "Test Event 2"});
  });

});

//=====================================================================================//

describe("Delete Event Tests", () => {

  test("Successfully find and delete event", async () => {
    newEventData = {
      title: "Test Birthday",
      creationUser: new mongoose.Types.ObjectId(),
      isAllDay: true,
      start: new Date(), 
      end: new Date(),
      recurrenceRule: "YEARLY"
    }
    let newEvent = new Events(newEventData);
    await newEvent.save();
    const response = await request.post("/api/events/deleteEvent").send({
      id: newEvent._id,
      creationUser: newEventData.creationUser
    });
    expect(response.statusCode).toBe(200);
  });

  test("No such event", async () => {
    const response = await request.post("/api/events/deleteEvent").send({
      id: new mongoose.Types.ObjectId(),
      creationUser: eventData.creationUser
    });
    expect(response.statusCode).toBe(400);
  });

  test("Invalid user permissions", async () => {
    const response = await request.post("/api/events/deleteEvent").send({
      id: Events.find({title: "Test Event"})._id,
      creationUser: new mongoose.Types.ObjectId()
    });
    expect(response.statusCode).toBe(400);
  });

});
