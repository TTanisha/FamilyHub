const app = require('../../app');
const Events = require('../../models/eventModel');
let supertest = require('supertest');
let request = supertest(app);
const mongoose = require('mongoose');
const mongodb = require('mongodb');
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

const user1 = new mongodb.ObjectId("63ed63e678178f779fa76b2c");
const user2 = new mongodb.ObjectId("63ed63e678178f779fa76b2d");

async function addDefaultEvents() {
  const event1 = {
    title: "Test Event 1",
    body: "Event description",
    creationUser: user1,
    isAllDay: false,
    start: new Date("February 17, 2023 12:00:00"), 
    end: new Date("February 17, 2023 15:00:00"),
    recurrenceRule: "ONCE"
  }
  const event2 = {
    title: "Test Event 2",
    body: "Event description",
    creationUser: user1,
    isAllDay: false,
    start: new Date("February 17, 2023 12:00:00"), 
    end: new Date("February 17, 2023 15:00:00"),
    recurrenceRule: "YEARLY"
  }
  const event3 = {
    title: "Test Event 3",
    body: "Event description",
    creationUser: user2,
    isAllDay: false,
    start: new Date("February 17, 2023 12:00:00"), 
    end: new Date("February 17, 2023 15:00:00"),
    recurrenceRule: "DAILY"
  }
  const event4 = {
    title: "Test Event 4",
    body: "Event description",
    creationUser: user2,
    isAllDay: false,
    start: new Date("February 17, 2023 12:00:00"), 
    end: new Date("February 17, 2023 15:00:00"),
    recurrenceRule: "ONCE"
  }
  const event5 = {
    title: "Test Event 5",
    body: "Event description",
    creationUser: user1,
    isAllDay: false,
    start: new Date("February 17, 2023 12:00:00"), 
    end: new Date("February 17, 2023 15:00:00"),
    recurrenceRule: "MONTHLY"
  }
  const event6 = {
    title: "Test Event 6",
    body: "Event description",
    creationUser: user1,
    isAllDay: false,
    start: new Date("February 17, 2023 12:00:00"), 
    end: new Date("February 17, 2023 15:00:00"),
    recurrenceRule: "YEARLY"
  }

  //await Events.insertMany([event1, event2, event3, event4, event5, event6]);
};

async function deleteDefaultEvents() {
  // make sure we have deleted the test events from the database
  try {
    //await Events.deleteMany({creationUser: user1});
    //await Events.deleteMany({creationUser: user2});
    await Events.findOneAndDelete(defaultEvent);
  } catch (err) {
    console.log("Events not found.");
  }
};

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
  //addDefaultEvents();
});

//=====================================================================================//

afterAll(async () => {
  //deleteDefaultEvents();
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

});

//=====================================================================================//

/* describe("Get Event(s) Tests", () => {
  test("Find event by id", async () => {
    const testEvent = Events.findOne(defaultEvent);
    const response = await request.get("/api/events/getEventById").send({
      id: testEvent._id
    });
    expect(response.statusCode).toBe(200);
  });

  test("Find events by name", async () => {
    
    const response = await request.get("/api/events/getEvents").send({
      
    });
    expect(response.statusCode).toBe(200);
  });

  test("Find events by date", async () => {
    const response = await request.get("/api/events/getEvents").send({
      
    });
    expect(response.statusCode).toBe(200);
  });

  test("Find events by user", async () => {
    const response = await request.get("/api/events/getEvents").send({
      creationUser: user1
    });
    expect(response.statusCode).toBe(200);
  });

  test("Find events by family group", async () => {
    const response = await request.get("/api/events/getEvents").send({
      
    });
    expect(response.statusCode).toBe(200);
  });

  test("Find events by location", async () => {
    const response = await request.get("/api/events/getEvents").send({
      
    });
    expect(response.statusCode).toBe(200);
  });

  test("No such event id", async () => {
    const response = await request.get("/api/events/getEventById").send({
      
    });
    expect(response.statusCode).toBe(400);
  });

  test("No such events", async () => {
    const response = await request.get("/api/events/getEvents").send({
      
    });
    expect(response.statusCode).toBe(400);
  });

}); */

//=====================================================================================//

/* describe("Update Event Tests", () => {

  test("Update event name", async () => {
    updateFields = {
      title: "New Integration Test Event"
    };
    const testEvent = await Events.find(defaultEvent);
    const response = await request.post("/api/events/updateEvent").send({
      id: testEvent._id,
      creationUser: testEvent.creationUser,
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(200);
    await Events.findByIdAndDelete(testEvent._id);
  });

  test("Invalid event name change", async () => {
    updateFields = {
      title: ""
    };
    const testEvent = await Events.find(defaultEvent);
    const response = await request.post("/api/events/updateEvent").send({
      id: testEvent._id,
      creationUser: testEvent.creationUser,
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(400);
  });

  test("Invalid recurrence rule change", async () => {
    updateFields = {
      recurrenceRule: "huh"
    };
    const testEvent = await Events.find(defaultEvent);
    const response = await request.post("/api/events/updateEvent").send({
      id: testEvent._id,
      creationUser: testEvent.creationUser,
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(400);
  });

  test("Invalid user permissions", async () => {
    const updateFields = {
      title: "New title"
    };
    const testEvent = await Events.find(defaultEvent);
    const response = await request.post("/api/events/updateEvent").send({
      id: testEvent._id,
      creationUser: new mongoose.Types.ObjectId(),
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(400);
  });

  test("No event found", async () => {
    const response = await request.post("/api/events/updateEvent").send({
      id: new mongoose.Types.ObjectId(),
      creationUser: user1
    });
    expect(response.statusCode).toBe(400);
  });

}); */

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
