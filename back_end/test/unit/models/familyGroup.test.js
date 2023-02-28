const FamilyGroups = require('../../../models/familyGroupModel');
const Users = require("../../../models/userModel");
const mongoose = require('mongoose');
const { ValidationError } = require('mongodb');
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//
let newFamilyGroup;

const defaultFamilyGroup = {
  groupName: "test family group"
};

const defaultUser = {
    email: "testfamily@model.com",
    password: "testPassword123",
    firstName: "testFirstName",
    lastName: "testLastName",
    birthday: new Date()
  };

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

  newFamilyGroup = new FamilyGroups(defaultFamilyGroup);
  await newFamilyGroup.save();
});

//=====================================================================================//

afterAll(async () => {
  // make sure we have deleted the test FamilyGroups from the database
  try {
    await FamilyGroups.findOneAndDelete(newFamilyGroup);
  } catch (err) {
    console.log("Family Group not found.");
  }

  await mongoose.connection.close().then(
    () => {console.log("Successfully disconnected from MongoDB.")},
    err => {console.error("Unable to disconnect from MongoDB.", err.message)}
  );
});

//=====================================================================================//

describe("Family Group Creation Tests", () => {
    test("Create a new Family Group without members", async () => {
      familygroupTest = {
        groupName: "test family group"
      };
      const fg = await FamilyGroups.create(familygroupTest);
      expect(fg.groupName).toBe(familygroupTest.groupName);
      await FamilyGroups.findOneAndDelete({_id: fg._id});    
    });

    test("Create a new Family Group without groupName", async () => {
        familygroupTest = {
        };
        const fg = FamilyGroups.create(familygroupTest);
        await expect(fg).rejects.toThrow(ValidationError);
    });

    test("Create a new Family Group with members", async () => {
        let newUser = new Users(defaultUser);
        familygroupTest = {
          groupName: "test family group", 
          $addToSet: {
            groupMembers: newUser,
        }
        };
        const fg = await FamilyGroups.create(familygroupTest);
        expect(fg.groupName).toBe(familygroupTest.groupName);
        await FamilyGroups.findOneAndDelete({_id: fg._id}); 
        await Users.findOneAndDelete({_id: newUser._id});  
   
      });
});

//=====================================================================================//

describe("Add Member to Family Group", () => {
    test("Add a family Member", async () => {
        let familygroupTest = {
          groupName: "test family group"
        };

        let newUser = new Users(defaultUser);
        await newUser.save();
        const testGroup = await FamilyGroups.create(familygroupTest);

        await FamilyGroups.updateOne({ _id: testGroup._id },
            {
                $addToSet: {
                    groupMembers: newUser,
                },
            });

        const updatedGroup = await FamilyGroups.findOne({ _id: testGroup._id });
        let result = [newUser._id];
        await Users.findOneAndDelete({_id: newUser._id});  
        await FamilyGroups.findOneAndDelete({_id: testGroup._id}); 
        expect(updatedGroup.groupMembers).toStrictEqual(result);
      });

      test("Add an empty family Member", async () => {
        familygroupTest = {
          groupName: "test family group"
        };
        const testGroup = await FamilyGroups.create(familygroupTest);
        FamilyGroups.updateOne({ _id: testGroup._id },
            {
                $addToSet: {
                    groupMembers: "",
                },
            });
        result = [];
        const updatedGroup = await FamilyGroups.findOne({ _id: testGroup._id });
        expect(updatedGroup.groupMembers).toStrictEqual(result);
        await FamilyGroups.findOneAndDelete({_id: testGroup._id});    
      });
});