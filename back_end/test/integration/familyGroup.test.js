const app = require("../../app");
const FamilyGroups = require("../../models/familyGroupModel");
const Users = require("../../models/userModel");

let supertest = require("supertest");
let request = supertest(app);
const mongoose = require("mongoose");
require("dotenv").config({ path: "config.env" }); // load environment variables

//=====================================================================================//

let defaultGroup;
let defaultUser;

const defaultGroupData = {
  groupName: "test family group",
};

const defaultUserData = {
  email: "testFamilyGroup@model.com",
  password: "testPassword123",
  firstName: "testFirstName",
  lastName: "testLastName",
  birthday: new Date(),
};

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
    },
  );

  try {
    FamilyGroups.createIndexes();
    defaultGroup = new FamilyGroups(defaultGroupData);
    await defaultGroup.save();
  } catch (err) {
    console.log("Unable to create default family group");
  }

  try {
    Users.createIndexes();
    defaultUser = new Users(defaultUserData);
    await defaultUser.save();
  } catch (err) {
    console.log("Unable to create default user");
  }
});

//=====================================================================================//

afterAll(async () => {
  // make sure we have deleted the test FamilyGroups from the database
  try {
    await FamilyGroups.findByIdAndDelete(defaultGroup._id);
  } catch (err) {
    console.log("Default Family Group not found.");
  }
  try {
    await Users.findByIdAndDelete(defaultUser._id);
  } catch (err) {
    console.log("Default user not found");
  }

  await mongoose.connection.close().then(
    () => {
      console.log("Successfully disconnected from MongoDB.");
    },
    (err) => {
      console.error("Unable to disconnect from MongoDB.", err.message);
    },
  );
});

//=====================================================================================//

describe("Family Group Integration Tests", () => {
  describe("Create Group", () => {
    describe("Given valid input", () => {
      it("Should create and return the new group", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/createFamilyGroup")
          .send({ groupName: "test create group" });
        expect(statusCode).toBe(200);
        expect(body.group.groupName).toBe("test create group");
        await FamilyGroups.findByIdAndDelete(body.group._id);
      });
    });

    describe("Given a duplicate group name", () => {
      it("Should create and return the new group", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/createFamilyGroup")
          .send({ groupName: defaultGroupData.groupName });
        expect(statusCode).toBe(200);
        expect(body.group.groupName).toBe(defaultGroupData.groupName);
        await FamilyGroups.findByIdAndDelete(body.group._id);
      });
    });

    describe("Given invalid group name", () => {
      it("Should return a validation fail status 401, and not create the group", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/createFamilyGroup")
          .send({ groupName: "" });
        expect(statusCode).toBe(401);
        expect(body.message).toBe(
          "FamilyGroups validation failed: groupName: A family group must have groupName",
        );
      });
    });

    describe("Given no group name", () => {
      it("Should return a validation fail status 401, and not create the group", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/createFamilyGroup")
          .send();
        expect(statusCode).toBe(401);
        expect(body.message).toBe(
          "FamilyGroups validation failed: groupName: A family group must have groupName",
        );
      });
    });
  });

  //=====================================================================================//

  describe("Get Group", () => {
    describe("Given a valid group ID", () => {
      it("Should return the group", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/getFamilyGroup")
          .send({ groupId: defaultGroup._id });
        expect(statusCode).toBe(200);
        expect(body.data.group.groupName).toBe(defaultGroupData.groupName);
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return a status 404", async () => {
        let groupId = new mongoose.Types.ObjectId();
        const { statusCode, body } = await request
          .post("/api/familyGroups/getFamilyGroup")
          .send({ groupId: groupId });
        expect(statusCode).toBe(404);
        expect(body.message).toBe("Group not found for id: " + groupId);
      });
    });
  });

  //=====================================================================================//

  describe("Update Group (Add User Membership)", () => {
    describe("Given a valid group ID and new user email", () => {
      it("Should return the group with new user added to the group", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/addMemberToFamilyGroup")
          .send({
            groupId: defaultGroup._id,
            memberEmail: defaultUser.email,
          });
        expect(statusCode).toBe(200);
        const result = body.data.group;
        expect(result.groupName).toBe(defaultGroup.groupName);
        expect(result.groupMembers).toStrictEqual([defaultUser._id.toString()]);
        // remove the user from the group, return to default state
        await FamilyGroups.findByIdAndUpdate(defaultGroup._id, {
          $pull: { groupMembers: defaultUser._id },
        });
      });
    });

    describe("Given a valid group ID and existing user email", () => {
      it("Should return a status 404 and the group with no change", async () => {
        // add first time
        const response = await request
          .post("/api/familyGroups/addMemberToFamilyGroup")
          .send({
            groupId: defaultGroup._id,
            memberEmail: defaultUser.email,
          });
        expect(response.statusCode).toBe(200);
        let check = await FamilyGroups.findById(defaultGroup._id);
        expect(check.groupMembers).toStrictEqual([defaultUser._id]);

        // add second time
        const { statusCode, body } = await request
          .post("/api/familyGroups/addMemberToFamilyGroup")
          .send({
            groupId: defaultGroup._id,
            memberEmail: defaultUser.email,
          });
        expect(statusCode).toBe(404);
        expect(body.message).toBe("Member already in family.");
        check = await FamilyGroups.findById(defaultGroup._id);
        expect(check.groupMembers).toStrictEqual([defaultUser._id]);
      });
    });

    describe("Given a valid group ID and invalid user email", () => {
      it("Should return a status 404", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/addMemberToFamilyGroup")
          .send({
            groupId: defaultGroup._id,
            memberEmail: "random@test.com",
          });
        expect(statusCode).toBe(404);
        expect(body.message).toBe("Member not found");
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return a status 404", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/addMemberToFamilyGroup")
          .send({
            groupId: new mongoose.Types.ObjectId(),
            memberEmail: defaultUser.email,
          });
        expect(statusCode).toBe(404);
        expect(body.message).toBe("Family Group not found");
      });
    });
  });

  //=====================================================================================//

  describe("Update Group (Remove User Membership)", () => {
    describe("Given a valid group ID and new user email", () => {
      describe("Given a user leaves the group and there are still members", () => {
        it("Should return the group without the user in the group", async () => {
          // First add a member
          await request.post("/api/familyGroups/addMemberToFamilyGroup").send({
            groupId: defaultGroup._id,
            memberEmail: defaultUserData.email,
          });
          // create second user
          let secondUser = await Users.create({
            email: "testfamily2@model.com",
            password: "testPassword123",
            firstName: "testFirstName",
            lastName: "testLastName",
            birthday: new Date(),
          });
          // add member to group
          expect(secondUser.email).toBe("testfamily2@model.com");
          const response = await request
            .post("/api/familyGroups/addMemberToFamilyGroup")
            .send({
              groupId: defaultGroup._id,
              memberEmail: secondUser.email,
            });
          expect(response.statusCode).toBe(200);
          //Now remove that member
          let newUser = await Users.findOne({ email: defaultUserData.email });
          const { statusCode, body } = await request
            .post("/api/familyGroups/leaveFamilyGroup")
            .send({
              groupId: defaultGroup._id,
              memberId: newUser._id,
            });
          await Users.findByIdAndDelete(secondUser._id);
          expect(statusCode).toBe(200);
          expect(body.data.groupMembers).toStrictEqual([
            secondUser._id.toString(),
          ]);
        });
      });

      describe("Given a user leaves and is the last member", () => {
        it("Should remove the group from the database", async () => {
          // First add a member
          await request.post("/api/familyGroups/addMemberToFamilyGroup").send({
            groupId: defaultGroup._id,
            memberEmail: defaultUserData.email,
          });
          //Now remove that member
          let newUser = await Users.findOne({ email: defaultUserData.email });
          const { statusCode, body } = await request
            .post("/api/familyGroups/leaveFamilyGroup")
            .send({
              groupId: defaultGroup._id,
              memberId: newUser._id,
            });
          expect(statusCode).toBe(200);
          expect(body.data.updatedGroup).toBe(undefined);
          const check = FamilyGroups.findById(defaultGroup._id);
          expect(check._id).toBe(undefined);
        });
      });
    });

    describe("Given a valid group ID and invalid user email", () => {
      it("Should return a user not found status 404", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/leaveFamilyGroup")
          .send({
            groupId: defaultGroup._id,
            memberId: new mongoose.Types.ObjectId(),
          });
        expect(statusCode).toBe(404);
        expect(body.message).toBe("User not found");
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return a family not found status 404", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/leaveFamilyGroup")
          .send({
            groupId: new mongoose.Types.ObjectId(),
            memberId: defaultUser._id,
          });
        expect(statusCode).toBe(404);
        expect(body.message).toBe("Family Group not found");
      });
    });
  });
});
