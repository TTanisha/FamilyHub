const app = require('../../app');
const Events = require('../../models/eventModel');
const FamilyGroups = require('../../models/familyGroupModel');
let supertest = require('supertest');
let request = supertest(app);
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//

const defaultEvent = {
  title: "Test Event",
  body: "Event description",
  creationUser: new mongoose.Types.ObjectId(),
  isAllDay: false,
  start: new Date("February 17, 2023 12:00:00"), 
  end: new Date("February 17, 2023 15:00:00"),
  recurrenceRule: "ONCE"
}

const user1 = new ObjectId("63ed63e678178f779fa76b2c");
const user2 = new ObjectId("63ed63e678178f779fa76b2d");

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

  Events.createIndexes();
  let newEvent = new Events(defaultEvent);
  await newEvent.save();
});

//=====================================================================================//

afterAll(async () => {
  try {
    await Events.findOneAndDelete(defaultEvent);
  } catch (err) {
    console.log("Events not found.");
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

  test("Create an event with no title", async () => {
    const response = await request.post("/api/events/createEvent").send({
      body: "Event description",
      creationUser: new mongoose.Types.ObjectId(),
      isAllDay: true,
      start: new Date("2023-01-17"), // year,month,day
      end: new Date("2023-01-17"),
      recurrenceRule: "ONCE"
    });
    expect(response.statusCode).toBe(400);
  });

  test("Create an event with an invalid title", async () => {
    const response = await request.post("/api/events/createEvent").send({
      title: "",
      body: "Event description",
      creationUser: new mongoose.Types.ObjectId(),
      isAllDay: true,
      start: new Date("2023-01-17"), // year,month,day
      end: new Date("2023-01-17"),
      recurrenceRule: "ONCE"
    });
    expect(response.statusCode).toBe(400);
  });

  test("Create an event with an invalid recurrence rule", async () => {
    const response = await request.post("/api/events/createEvent").send({
      title: "Test Event 2",
      body: "Event description",
      creationUser: new mongoose.Types.ObjectId(),
      isAllDay: true,
      start: new Date("2023-01-17"), // year,month,day
      end: new Date("2023-01-17"),
      recurrenceRule: "huh"
    });
    expect(response.statusCode).toBe(400);
  });

  test("Create an event associated with a family group", async () => {
    const groupData = {
      groupName: "Event Test Group", 
      groupMembers: user1
    }
    let testGroup = new FamilyGroups(groupData);
    await testGroup.save();

    const eventData = {
      title: "Event with group",
      body: "Event connected to a family group",
      creationUser: user1,
      isAllDay: true,
      start: new Date("2023-02-23"),
      end: new Date("2023-02-23"),
      recurrenceRule: "ONCE",
      familyGroup: testGroup._id
    };
    const event = await Events.create(eventData);
    expect(event.title).toBe(eventData.title);
    expect(event.familyGroup._id).toStrictEqual(testGroup._id);
    
    await Events.findOneAndDelete({title: eventData.title});
    await FamilyGroups.findByIdAndDelete(testGroup._id);
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
      creationUser: defaultEvent.creationUser
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
