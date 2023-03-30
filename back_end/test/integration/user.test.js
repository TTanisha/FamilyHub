const app = require("../../app");
const Users = require("../../models/userModel");
let supertest = require("supertest");
let request = supertest(app);
const mongoose = require("mongoose");
const FamilyGroups = require("../../models/familyGroupModel");
require("dotenv").config({ path: "config.env" }); // load environment variables

//=====================================================================================//

const defaultUser = {
  email: "test@integration.com",
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
    () => {console.log("Successfully connected to MongoDB.")},
    err => {console.error("Unable to connect to MongoDB.", err.message)}
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
    () => {console.log("Successfully disconnected from MongoDB.")},
    err => {console.error("Unable to disconnect from MongoDB.", err.message)}
  );
});

//=====================================================================================//

describe("User Integration  Tests", () => {
  describe("Create User", () => {
    describe("Given valid input data", () => {
      it("Should return the user", async () => {
        const { statusCode, body } = await request
          .post("/api/users/registerUser")
          .send({
            email: "testIntegration@gmail.com",
            password: "testPassword123",
            firstName: "testFirstName",
            lastName: "testLastName",
            birthday: new Date(),
          });
        expect(statusCode).toBe(201);
        expect(body.data.newUser.email).toBe("testIntegration@gmail.com");
        await Users.findOneAndDelete({ email: "testIntegration@gmail.com" });
      });
    });

    describe("Given all fields with valid data", () => {
      it("Should return the user", async () => {
        const { statusCode, body } = await request
          .post("/api/users/registerUser")
          .send({
            email: "testintegrationemail@test.com",
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
          });
        expect(statusCode).toBe(201);
        expect(body.data.newUser.email).toBe("testintegrationemail@test.com");
        await Users.findOneAndDelete({
          email: "testintegrationemail@test.com",
        });
      });
    });

    describe("Given input data with an existing email", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/registerUser")
          .send({
            email: defaultUser.email,
            password: "testPassword123",
            firstName: "testFirstName",
            lastName: "testLastName",
            birthday: new Date(),
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("Given input data without a first name", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/registerUser")
          .send({
            email: "testemail@gmail.com",
            password: "testPassword123",
            lastName: "testLastName",
            birthday: new Date(),
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("Given no password", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/registerUser")
          .send({
            email: "testemail@gmail.com",
            firstName: "testFirstName",
            lastName: "testLastName",
            birthday: new Date(),
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("Given input data with an invalid password", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/registerUser")
          .send({
            email: "testemail@gmail.com",
            password: "bad", // must be at least six characters long
            firstName: "testFirstName",
            lastName: "testLastName",
            birthday: new Date(),
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("Given input data with an invalid first name", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/registerUser")
          .send({
            email: "testemail@gmail.com",
            password: "testPassword123",
            firstName: "", // must be at least one character long
            lastName: "testLastName",
            birthday: new Date(),
          });
        expect(statusCode).toBe(400);
      });
    });
  });

  describe("Given input data with an invalid email", () => {
    it("Should return a 400 response", async () => {
      const res = await request.post("/api/users/registerUser").send({
        email: "notanemail",
        password: "testPassword123",
        firstName: "testFirstName",
        lastName: "testLastName",
        birthday: new Date(),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Please enter a valid email address.");
    });
  });

  //=====================================================================================//

  describe("Get User", () => {
    describe("Given a valid email and password", () => {
      it("Should return the user", async () => {
        const { statusCode, body } = await request
          .get("/api/users/getUser")
          .send({
            email: defaultUser.email,
            password: defaultUser.password,
          });
        expect(statusCode).toBe(200);
        expect(body.data.user.email).toBe(defaultUser.email);
        expect(body.data.user.password).toBe(defaultUser.password);
      });
    });

    describe("Given a valid email but invalid password", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request.get("/api/users/getUser").send({
          email: defaultUser.email,
          password: "badPassword123",
        });
        expect(statusCode).toBe(400);
      });
    });

    describe("Given invalid email and password", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request.get("/api/users/getUser").send({
          email: "testemail@test.com",
          password: "testPassword123",
        });
        expect(statusCode).toBe(400);
      });
    });

    describe("Given the ID is valid and exists in the database", () => {
      it("Should return the user information", async () => {
        const { statusCode, body } = await request
          .get("/api/users/getUserById")
          .send({
            id: defaultUser_ID,
          });

        const user = body.data.user;
        expect(statusCode).toBe(200);
        expect(user).not.toBe(null);
        expect(user._id).toStrictEqual(defaultUser_ID.toString());
        expect(user.email).toBe(defaultUser.email);
        expect(user.password).toBe(defaultUser.password);
        expect(user.firstName).toBe(defaultUser.firstName);
      });
    });

    describe("Given the ID is not valid", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .get("/api/users/getUserById")
          .send({
            id: new mongoose.Types.ObjectId(),
          });
        expect(statusCode).toBe(400);
      });
    });
  });

  //=====================================================================================//

  describe("Update User", () => {
    describe("Given valid input", () => {
      it("Should return the updated user", async () => {
        const { statusCode, body } = await request
          .post("/api/users/updateUser")
          .send({
            email: defaultUser.email,
            firstName: "newFirst",
          });
        expect(statusCode).toBe(200);
        expect(body.data.user.email).toBe(defaultUser.email);
        expect(body.data.user.firstName).toBe("newFirst");
        await Users.findByIdAndUpdate(defaultUser_ID, {
          firstName: defaultUser.firstName,
        });
      });
      it("Should return the updated user", async () => {
        const { statusCode, body } = await request
          .post("/api/users/updateUser")
          .send({
            id: defaultUser_ID,
            firstName: "another first",
          });
        expect(statusCode).toBe(200);
        expect(body.data.user.email).toBe(defaultUser.email);
        expect(body.data.user.firstName).toBe("another first");
        await Users.findByIdAndUpdate(defaultUser_ID, {
          firstName: defaultUser.firstName,
        });
      });
      it("Should return the updated user", async () => {
        const { statusCode, body } = await request
          .post("/api/users/updateUser")
          .send({
            id: defaultUser_ID,
            email: defaultUser.email,
            firstName: "first",
          });
        expect(statusCode).toBe(200);
        expect(body.data.user.email).toBe(defaultUser.email);
        expect(body.data.user.firstName).toBe("first");
        await Users.findByIdAndUpdate(defaultUser_ID, {
          firstName: defaultUser.firstName,
        });
      });
    });

    describe("Given valid input of non-required fields", () => {
      it("Should return updated user", async () => {
        const { statusCode, body } = await request
          .post("/api/users/updateUser")
          .send({
            email: defaultUser.email,
            cellNumber: 1237654,
            address: "new address, Winnipeg, MB, Canada",
          });
        expect(statusCode).toBe(200);
        const user = body.data.user;
        expect(user.email).toBe(defaultUser.email);
        expect(user.cellNumber).toBe(1237654);
        expect(user.address).toBe("new address, Winnipeg, MB, Canada");
        await Users.findByIdAndUpdate(defaultUser_ID, {
          cellNumber: defaultUser.cellNumber,
          address: defaultUser.address,
        });
      });
    });

    describe("Given an invalid last name", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/updateUser")
          .send({
            email: defaultUser.email,
            lastName: "",
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("Given the email already exists", () => {
      it("Should return a status 400", async () => {
        const tempUser = await Users.create({
          email: "newIntegration@test.ca",
          password: "password",
          firstName: "first",
          lastName: "last",
          birthday: new Date(),
        });
        const { statusCode } = await request
          .post("/api/users/updateUser")
          .send({
            email: tempUser.email,
            newEmail: defaultUser.email,
          });
        expect(statusCode).toBe(400);
        await Users.findByIdAndDelete(tempUser._id);
      });
    });

    describe("Given an invalid email", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/updateUser")
          .send({
            email: "bademail@test.com",
            firstName: "name",
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("Given no email or ID", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/updateUser")
          .send({
            firstName: "name",
          });
        expect(statusCode).toBe(400);
      });
    });
  });

  describe("Given valid email", () => {
    it("Should update user", async () => {
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

      const res = await request.post("/api/users/updateUser").send({
        email: "newUnit@test.ca",
        newEmail: "newUpdatedEmail@test.ca",
      });

      await Users.findByIdAndDelete(tempUser._id);
      expect(res.statusCode).toEqual(200);
    });
  });

  //=====================================================================================//

  describe("Delete User", () => {
    describe("Given a valid email", () => {
      it("Should remove the user from database, and return user", async () => {
        const testUser = await Users.create({
          email: "testIntegration@gmail.com",
          password: "testPassword123",
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
        });
        const { statusCode, body } = await request
          .post("/api/users/deleteUser")
          .send({
            email: testUser.email,
          });
        expect(statusCode).toBe(200);
        expect(body.data.user.email).toBe(testUser.email);
        check = await Users.find({ email: testUser.email });
        expect(check.length).toBe(0);
      });
    });

    describe("Given an invalid email", () => {
      it("Should return a status 400", async () => {
        const { statusCode } = await request
          .post("/api/users/deleteUser")
          .send({
            email: "bademail@test.com",
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("Delete user with a family group consisting of only 1 member", () => {
      it("Should remove the user and family group from database", async () => {
        const familyGroupData = {
          groupName: "family group",
        };

        const familyGroup = await FamilyGroups.create(familyGroupData);

        userData = {
          email: "testDelete@gmail.com",
          password: "testPassword123",
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
          groups: [familyGroup._id],
        };

        await Users.create(userData);

        const res = await request.post("/api/users/deleteUser").send({
          email: userData.email,
        });

        expect(res.statusCode).toEqual(200);
      });
    });

    describe("Delete user with a family group consisting of more than 1 member", () => {
      it("Should remove only the user from database", async () => {
        const familyGroupData = {
          groupName: "family group",
          groupMembers: [new mongoose.Types.ObjectId()],
        };

        const familyGroup = await FamilyGroups.create(familyGroupData);

        userData = {
          email: "testDelete@gmail.com",
          password: "testPassword123",
          firstName: "testFirstName",
          lastName: "testLastName",
          birthday: new Date(),
          groups: [familyGroup._id],
        };

        await Users.create(userData);

        const res = await request.post("/api/users/deleteUser").send({
          email: userData.email,
        });

        expect(res.statusCode).toEqual(200);

        await FamilyGroups.findOneAndRemove({ _id: familyGroup._id });
      });
    });
  });
});
