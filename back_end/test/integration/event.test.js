const app = require("../../app");
const Events = require("../../models/eventModel");
let supertest = require("supertest");
let request = supertest(app);
const mongoose = require("mongoose");
require("dotenv").config({ path: "config.env" }); // load environment variables

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
  familyGroup: familyGroup,
};

let defaultEvent_ID;

beforeAll(async () => {
  // Database connection
  const DB = process.env.TEST_DB;
  mongoose.set("strictQuery", false); // Preparation for deprecation
  const connectionOptions = {
    // Required due to changes in the MongoDB Node.js driver
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(DB, connectionOptions).then(
    () => {console.log("Successfully connected to MongoDB.")},
    err => {console.error("Unable to connect to MongoDB.", err.message)}
  );

  Events.createIndexes();
  let newEvent = new Events(defaultEvent);
  await newEvent.save();
  defaultEvent_ID = newEvent._id;
});

//=====================================================================================//

afterAll(async () => {
  try {
    await Events.findByIdAndDelete(defaultEvent_ID);
  } catch (err) {
    console.log("Events not found.");
  }

  await mongoose.connection.close().then(
    () => {console.log("Successfully disconnected from MongoDB.")},
    err => {console.error("Unable to disconnect from MongoDB.", err.message)}
  );
});

//=====================================================================================//

describe("Event / Shared Calendar Integration Tests", () => {
  describe("Create Event", () => {
    describe("Given valid input data", () => {
      it("Should return the event", async () => {
        const { statusCode, body } = await request
          .post("/api/events/createEvent")
          .send({
            title: "Test New Event",
            body: "Event description",
            creationUser: user1,
            isAllDay: true,
            start: new Date("2023-01-17"), // year,month,day
            end: new Date("2023-01-17"),
            recurrenceRule: "ONCE",
            familyGroup: familyGroup,
          });
        expect(statusCode).toBe(201);
        expect(body.data.newEvent.title).toBe("Test New Event");
        await Events.findOneAndDelete({ title: "Test New Event" });
      });
    });

    describe("Given input data without a title", () => {
      it("Should return a validation failed status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/createEvent")
          .send({
            body: "Event description",
            creationUser: user1,
            isAllDay: true,
            start: new Date("2023-01-17"), // year,month,day
            end: new Date("2023-01-17"),
            recurrenceRule: "ONCE",
            familyGroup: familyGroup,
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe(
          "Event validation failed: title: The event must have a name.",
        );
      });
    });

    describe("Given input data with an invalid title", () => {
      it("Should return a validation failed status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/createEvent")
          .send({
            title: "",
            body: "Event description",
            creationUser: user2,
            isAllDay: true,
            start: new Date("2023-01-17"), // year,month,day
            end: new Date("2023-01-17"),
            recurrenceRule: "ONCE",
            familyGroup: familyGroup,
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe(
          "Event validation failed: title: The event must have a name.",
        );
      });
    });

    describe("Given input data with an invalid recurrence rule", () => {
      it("Should return a validation failed status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/createEvent")
          .send({
            title: "Test Event 2",
            body: "Event description",
            creationUser: user2,
            isAllDay: true,
            start: new Date("2023-01-17"), // year,month,day
            end: new Date("2023-01-17"),
            recurrenceRule: "huh",
            recurrenceNum: 1,
            familyGroup: familyGroup,
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe(
          "Event validation failed: recurrenceRule: `huh` is not a valid enum value for path `recurrenceRule`.",
        );
      });
    });

    describe("Given input data with an invalid end date", () => {
      it("Should return an end date error status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/createEvent")
          .send({
            title: "Invalid end date test",
            body: "Event description",
            creationUser: new mongoose.Types.ObjectId(),
            isAllDay: true,
            start: new Date("2023-03-9"), // year,month,day
            end: new Date("2023-03-8"),
            recurrenceRule: "ONCE",
            familyGroup: familyGroup,
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe("Start date must be before end date.");
      });
    });

    describe("Given input data without a family group", () => {
      it("Should return a validation failed status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/createEvent")
          .send({
            title: "Event without group",
            body: "Event not connected to a family group",
            creationUser: user1,
            isAllDay: true,
            start: new Date("2023-02-23"),
            end: new Date("2023-02-23"),
            recurrenceRule: "ONCE",
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe(
          "Event validation failed: familyGroup: The event must belong to a family group.",
        );
      });
    });

    describe("Given invalid input fields", () => {
      it("Should create with only valid fields", async () => {
        const { statusCode } = await request
          .post("/api/events/createEvent")
          .send({
            title: "Weird New Event",
            body: "Event description",
            creationUser: user1,
            isAllDay: true,
            start: new Date("2023-01-17"), // year,month,day
            end: new Date("2023-01-17"),
            recurrenceRule: "ONCE",
            familyGroup: familyGroup,
            what: "doesn't exist",
          });
        expect(statusCode).toBe(201);
        let check = await Events.findOne({ what: "doesn't exist" });
        expect(check).toBe(null);
        check = await Events.findOne({ title: "Weird New Event" });
        expect(check.title).toBe("Weird New Event");
        await Events.findOneAndDelete({ title: "Weird New Event" });
      });
    });
  });

  //=====================================================================================//

  describe("Get Event", () => {
    describe("Given a valid event ID", () => {
      it("Should return the event", async () => {
        const { statusCode, body } = await request
          .get("/api/events/getEventById")
          .send({
            id: defaultEvent_ID,
          });
        expect(statusCode).toBe(200);
        expect(body.data.events._id).toStrictEqual(defaultEvent_ID.toString());
      });
    });

    describe("Given an invalid event ID", () => {
      it("Should return a status 400", async () => {
        const { statusCode, body } = await request
          .get("/api/events/getEventById")
          .send({
            id: new mongoose.Types.ObjectId(),
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe("Event not found");
      });
    });

    describe("Given a valid user ID", () => {
      it("Should return the events created by that user", async () => {
        const { statusCode, body } = await request
          .get("/api/events/getEvents")
          .send({
            creationUser: user1,
          });
        expect(statusCode).toBe(200);
        expect(body.data.events.length).toBe(1);
        expect(body.data.events[0]._id).toStrictEqual(
          defaultEvent_ID.toString(),
        );
        expect(body.message).toBe("Events found");
      });
      it("Should return no events if none were created, status 400", async () => {
        const { statusCode, body } = await request
          .get("/api/events/getEvents")
          .send({
            creationUser: user2,
          });
        expect(statusCode).toBe(400);
        expect(body.data.events.length).toBe(0);
        expect(body.message).toBe("No events found");
      });
    });

    describe("Given an invalid user ID", () => {
      it("Should return an empty list, status 400", async () => {
        const { statusCode, body } = await request
          .get("/api/events/getEvents")
          .send({
            creationUser: new mongoose.Types.ObjectId(),
          });
        expect(statusCode).toBe(400);
        expect(body.data.events.length).toBe(0);
        expect(body.message).toBe("No events found");
      });
    });

    describe("Given a valid family group", () => {
      it("Should return all events in that group", async () => {
        const { statusCode, body } = await request
          .get("/api/events/getEvents")
          .send({
            familyGroup: familyGroup,
          });
        expect(statusCode).toBe(200);
        expect(body.data.events.length).toBe(1);
        expect(body.data.events[0]._id).toStrictEqual(
          defaultEvent_ID.toString(),
        );
      });
    });

    describe("Given an invalid family group", () => {
      it("Should return an empty list, status 400", async () => {
        const { statusCode, body } = await request
          .get("/api/events/getEvents")
          .send({
            familyGroup: new mongoose.Types.ObjectId(),
          });
        expect(statusCode).toBe(400);
        expect(body.data.events.length).toBe(0);
        expect(body.message).toBe("No events found");
      });
    });

    describe("Given an invalid search field", () => {
      it("Should return an empty list, status 400", async () => {
        const { statusCode, body } = await request
          .get("/api/events/getEvents")
          .send({
            what: "field doesn't exist",
          });
        expect(statusCode).toBe(400);
        expect(body.data.events.length).toBe(0);
      });
    });
  });

  //=====================================================================================//

  describe("Update Event", () => {
    describe("Given valid input", () => {
      it("Should return the updated event", async () => {
        const { statusCode, body } = await request
          .post("/api/events/updateEvent")
          .send({
            id: defaultEvent_ID,
            creationUser: defaultEvent.creationUser,
            title: "New Test Event",
          });
        expect(statusCode).toBe(200);
        expect(body.data.eventToUpdate.title).toBe("New Test Event");
        expect(body.data.eventToUpdate._id).toStrictEqual(
          defaultEvent_ID.toString(),
        );
        await Events.findByIdAndUpdate(defaultEvent_ID, {
          title: defaultEvent.title,
        }); // put it back
      });
    });

    describe("Given no ID", () => {
      it("Should return an event not found status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/updateEvent")
          .send({
            creationUser: defaultEvent.creationUser,
            title: "New title",
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe("Event not found");
      });
    });

    describe("Given an invalid name", () => {
      it("Should return a validation failed status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/updateEvent")
          .send({
            id: defaultEvent_ID,
            creationUser: defaultEvent.creationUser,
            title: "",
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe(
          "Validation failed: title: The event must have a name.",
        );
      });
    });

    describe("Given an invalid recurrence rule", () => {
      it("Should return a validation failed status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/updateEvent")
          .send({
            id: defaultEvent_ID,
            creationUser: defaultEvent.creationUser,
            recurrenceRule: "huh",
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe(
          "Validation failed: recurrenceRule: `huh` is not a valid enum value for path `recurrenceRule`.",
        );
      });
    });

    describe("Given invalid user permissions", () => {
      it("Should return an invalid user permissions status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/updateEvent")
          .send({
            id: defaultEvent_ID,
            creationUser: new mongoose.Types.ObjectId(),
            title: "new event name",
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe("Invalid user permissions");
      });
    });
  });

  //=====================================================================================//

  describe("Delete Event", () => {
    describe("Given a valid ID", () => {
      it("Should remove the event from the database, and return event", async () => {
        newEventData = {
          title: "Test Birthday",
          creationUser: new mongoose.Types.ObjectId(),
          isAllDay: true,
          start: new Date(),
          end: new Date(),
          recurrenceRule: "YEARLY",
          familyGroup: familyGroup,
        };
        let newEvent = new Events(newEventData);
        await newEvent.save();
        const { statusCode, body } = await request
          .post("/api/events/deleteEvent")
          .send({
            id: newEvent._id,
            creationUser: newEventData.creationUser,
          });
        expect(statusCode).toBe(200);
        expect(body.data.eventToDelete.title).toBe(newEventData.title);
        const check = Events.findById(newEvent._id);
        expect(check._id).toBe(undefined);
      });
    });

    describe("Given an invalid ID", () => {
      it("Should return a event not found status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/deleteEvent")
          .send({
            id: new mongoose.Types.ObjectId(),
            creationUser: defaultEvent.creationUser,
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe("Event not found");
      });
    });

    describe("Given invalid user permissions", () => {
      it("Should return an invalid user permissions status 400", async () => {
        const { statusCode, body } = await request
          .post("/api/events/deleteEvent")
          .send({
            id: defaultEvent_ID,
            creationUser: new mongoose.Types.ObjectId(),
          });
        expect(statusCode).toBe(400);
        expect(body.message).toBe("Invalid User Permissions");
      });
    });
  });
});
