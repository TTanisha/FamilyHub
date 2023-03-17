const FamilyGroups = require("../../../models/familyGroupModel");
const Users = require("../../../models/userModel");
const mongoose = require("mongoose");
const ID = mongoose.Types.ObjectId;
const { ValidationError } = require("mongodb");
require("dotenv").config({ path: "config.env" }); // load environment variables

//=====================================================================================//

const defaultGroupData = {
  groupName: "test family group",
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
    () => {console.log("Successfully connected to MongoDB.")},
    err => {console.error("Unable to connect to MongoDB.", err.message)}
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
    () => {console.log("Successfully disconnected from MongoDB.")},
    err => {console.error("Unable to disconnect from MongoDB.", err.message)}
  );
});

//=====================================================================================//

describe("Family Group Unit Tests", () => {
  describe("Create Group", () => {
    describe("Given valid input", () => {
      it("Should create and return the new group", async () => {
        const result = await FamilyGroups.create({ groupName: "test group" });
        expect(result.groupName).toBe("test group");
        expect(await FamilyGroups.countDocuments()).toBe(2);
        await FamilyGroups.findByIdAndDelete(result._id);
      });
    });

    describe("Given a duplicate group name", () => {
      it("Should create and return the new group", async () => {
        const result = await FamilyGroups.create({
          groupName: defaultGroupData.groupName,
        });
        expect(result.groupName).toBe(defaultGroupData.groupName);
        expect(FamilyGroups.countDocuments.length).toBeGreaterThanOrEqual(2);
        await FamilyGroups.findByIdAndDelete(result._id);
      });
    });

    describe("Given invalid group name", () => {
      it("Should not create the group, throw validation error", async () => {
        const result = FamilyGroups.create({ groupName: "" });
        await expect(result).rejects.toThrow(ValidationError);
      });
    });

    describe("Given no group name", () => {
      it("Should not create the group, return undefined group", async () => {
        const result = await FamilyGroups.create();
        expect(result).toBe(undefined);
      });
    });
  });

  //=====================================================================================//

  describe("Get Group", () => {
    describe("Given a valid group ID", () => {
      it("Should return the group", async () => {
        const result = await FamilyGroups.findById(defaultGroup_ID);
        expect(result.groupName).toBe(defaultGroupData.groupName);
        expect(result._id).toStrictEqual(defaultGroup_ID);
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return null", async () => {
        const result = await FamilyGroups.findById(new ID());
        expect(result).toBe(null);
      });
    });
  });

  //=====================================================================================//

  describe("Update Group (Add User Membership)", () => {
    describe("Given a valid group ID and new user email", () => {
      it("Should return the group with new user added to the group", async () => {
        let testUser = await Users.findOne({ email: defaultUserData.email });
        let testGroup = await FamilyGroups.findById(defaultGroup_ID);

        const result = await FamilyGroups.findByIdAndUpdate(
          testGroup._id,
          {
            $addToSet: {
              groupMembers: testUser,
            },
          },
          { new: true },
        );
        expect(result.groupMembers).toStrictEqual([testUser._id]);
      });
    });

    describe("Given a valid group ID and existing user email", () => {
      it("Should return the group with no change", async () => {
        let testUser = await Users.findOne({ email: defaultUserData.email });
        let testGroup = await FamilyGroups.findById(defaultGroup_ID);

        await FamilyGroups.findByIdAndUpdate(testGroup._id, {
          $addToSet: {
            groupMembers: testUser,
          },
        });
        const result = await FamilyGroups.findByIdAndUpdate(
          testGroup._id,
          {
            $addToSet: {
              groupMembers: testUser,
            },
          },
          { new: true },
        );
        expect(result.groupMembers).toStrictEqual([testUser._id]);
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return a null", async () => {
        const result = await FamilyGroups.findByIdAndUpdate(new ID(), {
          $addToSet: { groupMembers: defaultUser_ID },
        });
        expect(result).toBe(null);
      });
    });
  });

  describe("Update Group (Remove User Membership)", () => {
    describe("Given a valid group ID and new user email", () => {
      it("Should return the group without the user in the group", async () => {
        let testUser = await Users.findOne({ email: defaultUserData.email });
        let testGroup = await FamilyGroups.findById(defaultGroup_ID);

        let result = await FamilyGroups.findByIdAndUpdate(
          testGroup._id,
          {
            $addToSet: {
              groupMembers: testUser,
            },
          },
          { new: true },
        );
        expect(result.groupMembers).toStrictEqual([testUser._id]);

        result = await FamilyGroups.findByIdAndUpdate(
          testGroup._id,
          {
            $pull: {
              groupMembers: testUser._id,
            },
          },
          { new: true },
        );
        expect(result.groupMembers).toStrictEqual([]);
      });
    });

    describe("Given a valid group ID and invalid user email", () => {
      it("Should return the group with no change", async () => {
        let testUser = await Users.findOne({ email: defaultUserData.email });
        let testGroup = await FamilyGroups.findById(defaultGroup_ID);

        let result = await FamilyGroups.findByIdAndUpdate(
          testGroup._id,
          {
            $addToSet: {
              groupMembers: testUser,
            },
          },
          { new: true },
        );
        expect(result.groupMembers).toStrictEqual([testUser._id]);

        result = await FamilyGroups.findByIdAndUpdate(
          testGroup._id,
          {
            $pull: {
              groupMembers: new ID(),
            },
          },
          { new: true },
        );
        expect(result.groupMembers).toStrictEqual([testUser._id]);
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return a null", async () => {
        const result = await FamilyGroups.findByIdAndUpdate(new ID(), {
          $pull: { groupMembers: defaultUser_ID },
        });
        expect(result).toBe(null);
      });
    });
  });

  //=====================================================================================//

  describe("Delete Group", () => {
    describe("Given a valid group ID", () => {
      it("Should return the deleted group", async () => {
        const testGroup = await FamilyGroups.create({
          groupName: "test delete group",
        });
        const result = await FamilyGroups.findByIdAndDelete(testGroup._id);
        expect(result._id).toStrictEqual(testGroup._id);
        expect(result.groupName).toBe(testGroup.groupName);
        const check = await FamilyGroups.findById(testGroup._id);
        expect(check).toBe(null);
      });
    });

    describe("Given an invalid group ID", () => {
      it("Should return null", async () => {
        const result = await FamilyGroups.findByIdAndDelete(new ID());
        expect(result).toBe(null);
      });
    });
  });
});
