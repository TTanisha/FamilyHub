const app = require("../../app");
const FamilyGroups = require("../../models/familyGroupModel");
const Users = require("../../models/userModel");

let supertest = require("supertest");
let request = supertest(app);
const mongoose = require("mongoose");
require("dotenv").config({ path: "config.env" }); // load environment variables

//=====================================================================================//

const defaultGroupData = {
  groupName: "Integration Test family group",
};

const defaultUserData = {
  email: "testfamily@model.com",
  password: "testPassword123",
  firstName: "testFirstName",
  lastName: "testLastName",
  birthday: new Date(),
};

let defaultGroup_ID;
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
    },
  );

  try {
    FamilyGroups.createIndexes();
    let defaultGroup = new FamilyGroups(defaultGroupData);
    await defaultGroup.save();
    defaultGroup_ID = defaultGroup._id;
  } catch (err) {
    console.log("Error creating the group");
  }
  try {
    Users.createIndexes();
    let defaultUser = new Users(defaultUserData);
    await defaultUser.save();
    defaultUser_ID = defaultUser._id;
  } catch (err) {
    console.log("Error creating the user.");
  }
});

//=====================================================================================//

afterAll(async () => {
  // make sure we have deleted the test FamilyGroups from the database
  try {
    await FamilyGroups.findByIdAndDelete(defaultGroup_ID);
  } catch (err) {
    console.log("Family Group not found.");
  }
  try {
    await Users.findByIdAndDelete(defaultUser_ID);
  } catch (err) {
    console.log("User not found.");
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

describe("Family Group Unit Tests", () => {
  describe("Create Group", () => {
    describe("Given valid input", () => {
      it("Should create and return the new group", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/createFamilyGroup")
          .send({ groupName: "test group" });
        expect(statusCode).toBe(200);
        expect(body.group.groupName).toBe("test group");
        expect(await FamilyGroups.countDocuments()).toBe(2);
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
        expect(await FamilyGroups.countDocuments()).toBe(2);
        await FamilyGroups.findByIdAndDelete(body.group._id);
      });
    });

    describe("Given invalid group name", () => {
      it("Should return a validation fail status 401, and not create the group", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/createFamilyGroup")
          .send({ groupName: "" });
        expect(statusCode).toBe(401);
        expect(body.error).toBe(
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
        expect(body.error).toBe(
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
          .send(defaultGroup_ID);
        expect(statusCode).toBe(200);
        expect(body.data.group.groupName).toBe(defaultGroupData.groupName);
        expect(body.data.group._id).toStrictEqual(defaultGroup_ID);
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return a status 404", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/getFamilyGroup")
          .send(new mongoose.Types.ObjectId());
        expect(statusCode).toBe(404);
        expect(body.message).toBe("Group not found");
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
            groupId: defaultGroup_ID,
            memberEmail: defaultUserData.email,
          });
        expect(statusCode).toBe(200);
        const result = body.data.group;
        expect(result.groupName).toBe(defaultGroupData.groupName);
        expect(result.groupMembers).toStrictEqual([defaultUser_ID]);
      });
    });

    describe("Given a valid group ID and existing user email", () => {
      it("Should return a status 404 and the group with no change", async () => {
        await request.post("/api/familyGroups/addMemberToFamilyGroup").send({
          groupId: defaultGroup_ID,
          memberEmail: defaultUserData.email,
        });
        const { statusCode, body } = await request
          .post("/api/familyGroups/addMemberToFamilyGroup")
          .send({
            groupId: defaultGroup_ID,
            memberEmail: defaultUserData.email,
          });
        expect(statusCode).toBe(404);
        expect(body.data.group.groupMembers).toStrictEqual([defaultUser_ID]);
      });
    });

    describe("Given a valid group ID and invalid user email", () => {
      it("Should return a status 404", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/addMemberToFamilyGroup")
          .send({
            groupId: defaultGroup_ID,
            memberEmail: "random@test.com",
          });
        expect(statusCode).toBe(404);
        expect(body.message).toBe(
          "Member not found Member not successfully added to group",
        );
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return a status 404", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/addMemberToFamilyGroup")
          .send({
            groupId: new mongoose.Types.ObjectId(),
            memberEmail: defaultUserData.email,
          });
        expect(statusCode).toBe(404);
        expect(body.message).toBe(
          "Family Group not found Member not successfully added to group",
        );
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
            groupId: defaultGroup_ID,
            memberEmail: defaultUserData.email,
          });
          let secondUser = await Users.create({
            email: "testfamily2@model.com",
            password: "testPassword123",
            firstName: "testFirstName",
            lastName: "testLastName",
            birthday: new Date(),
          });
          await request.post("/api/familyGroups/addMemberToFamilyGroup").send({
            groupId: defaultGroup_ID,
            memberEmail: secondUser.email,
          });
          //Now remove that member
          let newUser = await Users.findOne({ email: defaultUserData.email });
          const { statusCode, body } = await request
            .post("/api/familyGroups/leaveFamilyGroup")
            .send({
              groupId: defaultGroup_ID,
              memberId: newUser._id,
            });
          expect(statusCode).toBe(200);
          expect(body.data.updatedGroup).toStrictEqual([secondUser._id]);
          await Users.findByIdAndDelete(newUser._id);
        });

        describe("Given a user leaves and is the last member", () => {
          it("Should remove the group from the database", async () => {
            // First add a member
            await request
              .post("/api/familyGroups/addMemberToFamilyGroup")
              .send({
                groupId: defaultGroup_ID,
                memberEmail: defaultUserData.email,
              });
            //Now remove that member
            let newUser = await Users.findOne({ email: defaultUserData.email });
            const { statusCode, body } = await request
              .post("/api/familyGroups/leaveFamilyGroup")
              .send({
                groupId: defaultGroup_ID,
                memberId: newUser._id,
              });
            expect(statusCode).toBe(200);
            expect(body.data.updatedGroup).toStrictEqual([]);
            const check = FamilyGroups.findById(defaultGroup_ID);
            expect(check).toBe(null);
          });
        });
      });
    });

    describe("Given a valid group ID and invalid user email", () => {
      it("Should return a user not found status 404", async () => {
        const { statusCode, body } = await request
          .post("/api/familyGroups/leaveFamilyGroup")
          .send({
            groupId: defaultGroup_ID,
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
            memberId: defaultUser_ID,
          });
        expect(statusCode).toBe(404);
        expect(body.message).toBe("Family Group not found");
      });
    });
  });
});
