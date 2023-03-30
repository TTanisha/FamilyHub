const Users = require("../../../models/userModel");
const mongoose = require("mongoose");
const { ValidationError } = require("mongodb");
require("dotenv").config({ path: "config.env" }); // load environment variables

//=====================================================================================//

const defaultUser = {
  email: "test@model.com",
  password: "testPassword123",
  firstName: "testFirstName",
  lastName: "testLastName",
  birthday: new Date(),
};

let defaultUser_ID;

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
    () => {
      console.log("Successfully connected to MongoDB.");
    },
    (err) => {
      console.error("Unable to connect to MongoDB.", err.message);
    }
  );

  try {
    Users.createIndexes();
    let newUser = new Users(defaultUser);
    await newUser.save();
    defaultUser_ID = newUser._id;
  } catch (err) {
    console.log("Error creating User.");
  }
});

//=====================================================================================//

afterAll(async () => {
  // make sure we have deleted the test users from the database
  try {
    await Users.findOneAndDelete({ email: defaultUser.email });
  } catch (err) {
    console.log("User not found.");
  }

  await mongoose.connection.close().then(
    () => {
      console.log("Successfully disconnected from MongoDB.");
    },
    (err) => {
      console.error("Unable to disconnect from MongoDB.", err.message);
    }
  );
});

//=====================================================================================//

describe("User Unit Tests", () => {
  describe("Create User", () => {
    describe("Given valid input data", () => {
      it("Should return the user", async () => {
        userData = {
          email: "testunit@gmail.com",
          password: "testPassword123",
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
        };
        const user = await Users.create(userData);
        expect(user.email).toBe(userData.email);
        await Users.findOneAndDelete({ email: userData.email });
      });
    });

    describe("Given all fields with valid data", () => {
      it("Should return the user", async () => {
        userData = {
          email: "testmodelemail@gmail.com",
          password: "testPassword123",
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
          nickname: "name",
          pronouns: "she/her",
          displayEmail: "testemail@gmail.com",
          address: "111 test street, Winnipeg, MB, Canada",
          cellNumber: 1234567,
          homeNumber: 5555555,
        };
        const user = await Users.create(userData);
        expect(user.email).toBe(userData.email);
        await Users.findOneAndDelete({ email: userData.email });
      });
    });

    describe("Given input data with an existing email", () => {
      it("Should throw a duplicate key error", async () => {
        userData = {
          email: defaultUser.email,
          password: "testPassword123",
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
        };
        const user = Users.create(userData);
        await expect(user).rejects.toThrow("11000"); // duplicate key
      });
    });

    describe("Given input data without a first name", () => {
      it("Should throw a validation error", async () => {
        userData = {
          email: "testemail@gmail.com",
          password: "testPassword123",
          lastName: "testLastName",
          birthday: new Date(),
        };
        const user = Users.create(userData);
        await expect(user).rejects.toThrow(ValidationError);
      });
    });

    describe("Given input data without a last name", () => {
      it("Should throw a validation error", async () => {
        userData = {
          email: "testemail@gmail.com",
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
        };
        const user = Users.create(userData);
        await expect(user).rejects.toThrow(ValidationError);
      });
    });

    describe("Given input data with an invalid password", () => {
      it("Should throw a validation error", async () => {
        userData = {
          email: "testemail@gmail.com",
          password: "bad", // must be at least six characters long
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
        };
        const user = Users.create(userData);
        await expect(user).rejects.toThrow(ValidationError);
      });
    });

    describe("Given input data with an invalid first name", () => {
      it("Should throw a validation error", async () => {
        userData = {
          email: "testemail@gmail.com",
          password: "testPassword123",
          firstName: "", // must be at least one character long
          lastName: "testLastName",
          birthday: new Date(),
        };
        const user = Users.create(userData);
        await expect(user).rejects.toThrow(ValidationError);
      });
    });
  });

  //=====================================================================================//

  describe("Get User", () => {
    describe("Given a valid email and password", () => {
      it("Should return the user", async () => {
        const user = await Users.findOne({
          email: defaultUser.email,
          password: defaultUser.password,
        });
        expect(user.email).toBe(defaultUser.email);
        expect(user.password).toBe(defaultUser.password);
      });
    });

    describe("Given a valid email but invalid password", () => {
      it("Should return null", async () => {
        userData = {
          email: defaultUser.email,
          password: "badPassword123",
        };
        const user = await Users.findOne(userData);
        expect(user).toBe(null);
      });
    });

    describe("Given invalid email and password", () => {
      it("Should return null", async () => {
        userData = {
          email: "testemail@test.com",
          password: "testPassword123",
        };
        const user = await Users.findOne(userData);
        expect(user).toBe(null);
      });
    });

    describe("Given the ID is valid and exists in the database", () => {
      it("Should return the user information", async () => {
        const user = await Users.findById(defaultUser_ID);
        expect(user._id).toStrictEqual(defaultUser_ID);
        expect(user.email).toBe(defaultUser.email);
        expect(user.password).toBe(defaultUser.password);
        expect(user.firstName).toBe(defaultUser.firstName);
      });
    });

    describe("Given the ID is not valid", () => {
      it("Should return null", async () => {
        test_id = new mongoose.Types.ObjectId();
        const user = await Users.findById(test_id);
        expect(user).toBe(null);
      });
    });
  });

  //=====================================================================================//

  describe("Update User", () => {
    describe("Given valid input", () => {
      it("Should return the updated user", async () => {
        filter = { email: defaultUser.email };
        updateFields = {
          firstName: "newFirst",
        };
        const user = await Users.findOneAndUpdate(filter, updateFields, {
          new: true,
        });
        expect(user.email).toBe(filter.email);
        expect(user.firstName).toBe(updateFields.firstName);
        await Users.findByIdAndUpdate(defaultUser_ID, {
          firstName: defaultUser.firstName,
        });
      });
    });

    describe("Given valid input of non-required fields", () => {
      it("Should return updated user", async () => {
        filter = { email: defaultUser.email };
        updateFields = {
          cellNumber: 1237654,
          address: "new address, Winnipeg, MB, Canada",
        };
        const user = await Users.findOneAndUpdate(filter, updateFields, {
          new: true,
        });
        expect(user.email).toBe(filter.email);
        expect(user.cellNumber).toBe(updateFields.cellNumber);
        expect(user.address).toBe(updateFields.address);
        await Users.findByIdAndUpdate(defaultUser_ID, {
          cellNumber: defaultUser.cellNumber,
          address: defaultUser.address,
        });
      });
    });

    describe("Given an invalid last name", () => {
      it("Should cause no change", async () => {
        filter = { email: defaultUser.email };
        updateFields = {
          lastName: "",
        };
        const user = await Users.findOneAndUpdate(filter, updateFields);
        expect(user.email).toBe(filter.email);
        expect(user.lastName).toBe(defaultUser.lastName);
      });
    });

    describe("Given the email already exists", () => {
      it("Should throw a duplicate key error", async () => {
        const tempUser = await Users.create({
          email: "newUnit@test.ca",
          password: "password",
          firstName: "first",
          lastName: "last",
          birthday: new Date(),
        });
        filter = { email: tempUser.email };
        updateFields = {
          email: defaultUser.email,
        };

        const user = Users.findOneAndUpdate(filter, updateFields, {
          new: true,
          runValidators: true,
        });
        await expect(user).rejects.toThrow("11000"); // duplicate key
        await Users.findByIdAndDelete(tempUser._id);
      });
    });

    describe("Given an invalid email", () => {
      it("Should return null", async () => {
        filter = { email: "bademail@test.com" };
        updateFields = {
          password: "newPassword",
        };
        const user = await Users.findOneAndUpdate(filter, updateFields, {
          new: true,
        });
        expect(user).toBe(null);
      });
    });
  });

  //=====================================================================================//

  describe("Delete User", () => {
    describe("Given a valid email", () => {
      it("Should remove the user from database, and return user", async () => {
        userData = {
          email: "testUnit@gmail.com",
          password: "testPassword123",
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
        };
        const user = await Users.create(userData);
        const deletedUser = await Users.findOneAndDelete({
          email: userData.email,
        });
        expect(deletedUser.email).toBe(userData.email);
        expect(deletedUser.password).toBe(user.password);
        check = await Users.find({ email: user.email });
        expect(check.length).toBe(0);
      });
    });

    describe("Given an invalid email", () => {
      it("Should return null", async () => {
        const user = await Users.findOneAndDelete({
          email: "bademail@test.com",
        });
        expect(user).toBe(null);
      });
    });
  });
});
