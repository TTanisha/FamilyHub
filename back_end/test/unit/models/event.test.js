const Events = require('../../../models/eventModel');
const mongoose = require('mongoose');
const { ValidationError } = require('mongodb')
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//

const user1 = new mongoose.Types.ObjectId();
const user2 = new mongoose.Types.ObjectId();
const familyGroup = new mongoose.Types.ObjectId();

const defaultEvent = {
  title: "Test Event",
  body: "Event description",
  creationUser: user1,
  isAllDay: false,
  start: new Date("February 17, 2023 12:00:00"), 
  end: new Date("February 17, 2023 15:00:00"),
  recurrenceRule: "ONCE",
  familyGroup: familyGroup
}

beforeAll(async () => {
  // Database connection
  const DB = process.env.FAMILYHUB_DB_URI;
  mongoose.set('strictQuery', false); // Preparation for deprecation 
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
  // make sure we have deleted the test events from the database
  try {
    await Events.findOneAndDelete(defaultEvent);
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
    const eventData = {
      title: "new event",
      body: "Event description",
      creationUser: user1,
      isAllDay: true,
      start: new Date("2023-01-17"), // year,month,day
      end: new Date("2023-01-17"),
      recurrenceRule: "ONCE",
      familyGroup: familyGroup
    };
    const event = await Events.create(eventData);
    expect(event.title).toBe(eventData.title);
    expect(event.familyGroup._id).toStrictEqual(familyGroup);
    await Events.findOneAndDelete({title: eventData.title});
  });

  test("Create an event with no title", async () => {
    const eventData = {
      body: "Event description",
      creationUser: user2,
      isAllDay: true,
      start: new Date("2023-01-17"), // year,month,day
      end: new Date("2023-01-17"),
      recurrenceRule: "ONCE",
      familyGroup: familyGroup
    };
    const event = Events.create(eventData);
    await expect(event).rejects.toThrow();
  });

  test("Create an event with an invalid title", async () => {
    const eventData = {
      title: "",
      body: "Event description",
      creationUser: user2,
      isAllDay: true,
      start: new Date("2023-01-17"), // year,month,day
      end: new Date("2023-01-17"),
      recurrenceRule: "ONCE",
      familyGroup: familyGroup
    };
    const event = Events.create(eventData);
    await expect(event).rejects.toThrow();
  });

  test("Create an event with an invalid recurrence rule", async () => {
    const eventData = {
      title: "Test Event 2",
      body: "Event description",
      creationUser: new mongoose.Types.ObjectId(),
      isAllDay: true,
      start: new Date("2023-01-17"), // year,month,day
      end: new Date("2023-01-17"),
      recurrenceRule: "huh",
      familyGroup: familyGroup
    };
    const event = Events.create(eventData);
    await expect(event).rejects.toThrow();
  });

  test("Create an event without a family group", async () => {
    const eventData = {
      title: "Event without group",
      body: "Event not connected to a family group",
      creationUser: user1,
      isAllDay: true,
      start: new Date("2023-02-23"),
      end: new Date("2023-02-23"),
      recurrenceRule: "ONCE"
    };
    const event = Events.create(eventData);
    await expect(event).rejects.toThrow();
  });

});

//=====================================================================================//

describe("Update Event Tests", () => {

  test("Update event name", async () => {
    const testEvent = await Events.findOne(defaultEvent);
    const filter = {
      _id: testEvent._id,
      creationUser: testEvent.creationUser
    };
    const updateFields = {
      title: "New Unit Test Event"
    };
    const options = {
      new: true, 
      runValidators: true
    };
    const event = await Events.findOneAndUpdate(filter, updateFields, options);
    expect(event._id).toStrictEqual(testEvent._id);
    expect(event.title).toBe(updateFields.title);
    await Events.findByIdAndUpdate(event._id, {title: defaultEvent.title}); // put it back
  });

  test("Invalid event name change", async () => {
    testEvent = await Events.findOne(defaultEvent);
    const filter = {
      _id: testEvent._id,
      creationUser: testEvent.creationUser
    };
    updateFields = {
      title: ""
    };
    const options = {
      new: true, 
      runValidators: true
    };
    const event = Events.findOneAndUpdate(filter, updateFields, options);
    await expect(event).rejects.toThrow(ValidationError);
    testEvent = await Events.findOne(defaultEvent);
    expect(testEvent.title).toBe(defaultEvent.title);
  });

  test("Invalid recurrence rule change", async () => {
    testEvent = await Events.findOne(defaultEvent);
    const filter = {
      _id: testEvent._id,
      creationUser: testEvent.creationUser
    };
    updateFields = {
      recurrenceRule: "huh"
    };
    const options = {
      new: true, 
      runValidators: true
    };
    const event = Events.findOneAndUpdate(filter, updateFields, options);
    await expect(event).rejects.toThrow(ValidationError);
    testEvent = await Events.findOne(defaultEvent);
    expect(testEvent.recurrenceRule).toBe(defaultEvent.recurrenceRule);
  });

  test("Invalid user permissions", async () => {
    testEvent = await Events.findOne(defaultEvent);
    const filter = {
      _id: testEvent._id,
      creationUser: new mongoose.Types.ObjectId(),
    };
    updateFields = {
      title: "new event name"
    };
    const options = {
      new: true, 
      runValidators: true
    };
    const event = await Events.findOneAndUpdate(filter, updateFields, options);
    expect(event).toBe(null);
    testEvent = await Events.findOne(defaultEvent);
    expect(testEvent.title).toBe(defaultEvent.title);
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
      recurrenceRule: "YEARLY",
      familyGroup: familyGroup
    }
    let newEvent = new Events(newEventData);
    await newEvent.save();
    const event = await Events.findByIdAndDelete(newEvent._id);
    expect(event._id).toStrictEqual(newEvent._id);
    const check = Events.findOne(newEventData);
    expect(check._id).toBe(undefined);
  });

  test("No such event", async () => {
    const event = Events.findByIdAndDelete(new mongoose.Types.ObjectId());
    expect(event._id).toBe(undefined);
  });

});
