const Events = require("../../../models/eventModel");
const { validateEventDates } = require("../../../controllers/eventController");
const mongoose = require("mongoose");
const { ValidationError } = require("mongodb");
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
  // make sure we have deleted the test events from the database
  try {
    await Events.findByIdAndDelete(defaultEvent_ID);
  } catch (err) {
    console.log("Event not found.");
  }

  await mongoose.connection.close().then(
    () => {console.log("Successfully disconnected from MongoDB.")},
    err => {console.error("Unable to disconnect from MongoDB.", err.message)}
  );
});

//=====================================================================================//

describe("Event / Shared Calendar Unit Tests", () => {
  describe("Create Event", () => {
    describe("Given valid input data", () => {
      it("Should return the event", async () => {
        const eventData = {
          title: "new event",
          body: "Event description",
          creationUser: user1,
          isAllDay: true,
          start: new Date("2023-01-17"), // year,month,day
          end: new Date("2023-01-17"),
          recurrenceRule: "ONCE",
          familyGroup: familyGroup,
        };
        expect(validateEventDates(eventData)).toBe(true);
        const event = await Events.create(eventData);
        expect(event.title).toBe(eventData.title);
        expect(event.familyGroup._id).toStrictEqual(familyGroup);
        await Events.findOneAndDelete({ title: eventData.title });
      });
    });

    describe("Given input data without a title", () => {
      it("Should throw a validation error", async () => {
        const eventData = {
          body: "Event description",
          creationUser: user2,
          isAllDay: true,
          start: new Date("2023-01-17"), // year,month,day
          end: new Date("2023-01-17"),
          recurrenceRule: "ONCE",
          familyGroup: familyGroup,
        };
        expect(validateEventDates(eventData)).toBe(true);
        const event = Events.create(eventData);
        await expect(event).rejects.toThrow(ValidationError);
      });
    });

    describe("Given input data with an invalid title", () => {
      it("Should throw a validation error", async () => {
        const eventData = {
          title: "",
          body: "Event description",
          creationUser: user2,
          isAllDay: true,
          start: new Date("2023-01-17"), // year,month,day
          end: new Date("2023-01-17"),
          recurrenceRule: "ONCE",
          familyGroup: familyGroup,
        };
        expect(validateEventDates(eventData)).toBe(true);
        const event = Events.create(eventData);
        await expect(event).rejects.toThrow(ValidationError);
      });
    });

    describe("Given input data with an invalid recurrence rule", () => {
      it("Should throw a validation error", async () => {
        const eventData = {
          title: "Test Event 2",
          body: "Event description",
          creationUser: new mongoose.Types.ObjectId(),
          isAllDay: true,
          start: new Date("2023-01-17"), // year,month,day
          end: new Date("2023-01-17"),
          recurrenceRule: "huh",
          familyGroup: familyGroup,
        };
        expect(validateEventDates(eventData)).toBe(true);
        const event = Events.create(eventData);
        await expect(event).rejects.toThrow(ValidationError);
      });
    });

    describe("Given input data with an invalid end date", () => {
      it("Should throw a custom validation error", async () => {
        const eventData = {
          title: "Invalid end date test",
          body: "Event description",
          creationUser: new mongoose.Types.ObjectId(),
          isAllDay: true,
          start: new Date("2023-03-9"), // year,month,day
          end: new Date("2023-03-8"),
          recurrenceRule: "ONCE",
          familyGroup: familyGroup,
        };
        expect(() => {
          validateEventDates(eventData);
        }).toThrow("Start date must be before end date.");
      });
    });

    describe("Given input data without a family group", () => {
      it("Should throw a validation error", async () => {
        const eventData = {
          title: "Event without group",
          body: "Event not connected to a family group",
          creationUser: user1,
          isAllDay: true,
          start: new Date("2023-02-23"),
          end: new Date("2023-02-23"),
          recurrenceRule: "ONCE",
        };
        const event = Events.create(eventData);
        await expect(event).rejects.toThrow(ValidationError);
      });
    });
  });

  describe("Given input data with null dates", () => {
    it("Should throw an error", async () => {
      const eventData = {
        title: "Event without group",
        body: "Event not connected to a family group",
        creationUser: user1,
        isAllDay: true,
        start: null,
        end: null,
        recurrenceRule: "ONCE",
      };

      const event = () => {
        validateEventDates(eventData)
      };

      await expect(event).toThrow(Error);
      await expect(event).toThrow("Date values cannot be null.");
    });
  });

  //=====================================================================================//

  describe("Get Event", () => {
    describe("Given a valid user ID", () => {
      it("Should return the events created by that user", async () => {
        const result = await Events.find({ creationUser: user1 });
        expect(result.length).toBe(1);
        expect(result[0]._id).toStrictEqual(defaultEvent_ID);
      });
      it("Should return no events if none were created", async () => {
        const result = await Events.find({ creationUser: user2 });
        expect(result.length).toBe(0);
      });
    });

    describe("Given an invalid user ID", () => {
      it("Should return an empty list", async () => {
        const result = await Events.find({
          creationUser: new mongoose.Types.ObjectId(),
        });
        expect(result.length).toBe(0);
      });
    });

    describe("Given a valid event ID", () => {
      it("Should return the event", async () => {
        const result = await Events.findById(defaultEvent_ID);
        expect(result.title).toBe(defaultEvent.title);
      });
    });

    describe("Given an invalid event ID", () => {
      it("Should return null", async () => {
        const result = await Events.findById(new mongoose.Types.ObjectId());
        expect(result).toBe(null);
      });
    });

    describe("Given a valid family group", () => {
      it("Should return all events in that group", async () => {
        const result = await Events.find({ familyGroup: familyGroup });
        expect(result.length).toBe(1);
        expect(result[0]._id).toStrictEqual(defaultEvent_ID);
      });
    });

    describe("Given an invalid family group", () => {
      it("Should return an empty list", async () => {
        const result = await Events.find({
          familyGroup: new mongoose.Types.ObjectId(),
        });
        expect(result.length).toBe(0);
      });
    });
  });

  //=====================================================================================//

  describe("Update Event", () => {
    describe("Given valid input", () => {
      it("Should return the updated event", async () => {
        const testEvent = await Events.findById(defaultEvent_ID);
        const filter = {
          _id: testEvent._id,
          creationUser: testEvent.creationUser,
        };
        const updateFields = {
          title: "New Unit Test Event",
        };
        const options = {
          new: true,
          runValidators: true,
        };
        const event = await Events.findOneAndUpdate(
          filter,
          updateFields,
          options,
        );
        expect(event._id).toStrictEqual(testEvent._id);
        expect(event.title).toBe(updateFields.title);
        await Events.findByIdAndUpdate(event._id, {
          title: defaultEvent.title,
        }); // put it back
      });
    });

    describe("Given an invalid name", () => {
      it("Should throw a validation error and cause no change", async () => {
        testEvent = await Events.findById(defaultEvent_ID);
        const filter = {
          _id: testEvent._id,
          creationUser: testEvent.creationUser,
        };
        updateFields = {
          title: "",
        };
        const options = {
          new: true,
          runValidators: true,
        };
        const event = Events.findOneAndUpdate(filter, updateFields, options);
        await expect(event).rejects.toThrow(ValidationError);
        testEvent = await Events.findById(defaultEvent_ID);
        expect(testEvent.title).toBe(defaultEvent.title);
      });
    });

    describe("Given an invalid recurrence rule", () => {
      it("Should throw a validation error and cause no change", async () => {
        testEvent = await Events.findById(defaultEvent_ID);
        const filter = {
          _id: testEvent._id,
          creationUser: testEvent.creationUser,
        };
        updateFields = {
          recurrenceRule: "huh",
        };
        const options = {
          new: true,
          runValidators: true,
        };
        const event = Events.findOneAndUpdate(filter, updateFields, options);
        await expect(event).rejects.toThrow(ValidationError);
        testEvent = await Events.findById(defaultEvent_ID);
        expect(testEvent.recurrenceRule).toBe(defaultEvent.recurrenceRule);
      });
    });

    describe("Given invalid user permissions", () => {
      it("Should cause no change", async () => {
        testEvent = await Events.findById(defaultEvent_ID);
        const filter = {
          _id: testEvent._id,
          creationUser: new mongoose.Types.ObjectId(),
        };
        updateFields = {
          title: "new event name",
        };
        const options = {
          new: true,
          runValidators: true,
        };
        const event = await Events.findOneAndUpdate(
          filter,
          updateFields,
          options,
        );
        expect(event).toBe(null);
        testEvent = await Events.findById(defaultEvent_ID);
        expect(testEvent.title).toBe(defaultEvent.title);
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
        const event = await Events.findByIdAndDelete(newEvent._id);
        expect(event._id).toStrictEqual(newEvent._id);
        const check = Events.findOne(newEventData);
        expect(check._id).toBe(undefined);
      });
    });

    describe("Given an invalid ID", () => {
      it("Should return an event with an undefined ID", async () => {
        const event = Events.findByIdAndDelete(new mongoose.Types.ObjectId());
        expect(event._id).toBe(undefined);
      });
    });
  });
});
