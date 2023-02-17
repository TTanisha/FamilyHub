const FamilyGroups = require('../../../models/familyGroupModel');
const Users = require("../../../models/userModel");
const mongoose = require('mongoose');
const { ValidationError } = require('mongodb')
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//
let newFamilyGroup;

const defaultFamilyGroup = {
  groupName: "test family group"
};

const defaultUser = {
    email: "test@model.com",
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

  FamilyGroups.createIndexes();
  newFamilyGroup = new FamilyGroups(defaultFamilyGroup);
  await newFamilyGroup.save();

});

//=====================================================================================//

afterAll(async () => {
  // make sure we have deleted the test FamilyGroups from the database
  try {
    await FamilyGroups.findOneAndDelete({_id: newFamilyGroup._id});
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
        familygroupTest = {
          groupName: "test family group", 
          $addToSet: {
            groupMembers:     "0000",
        }
        };
        const fg = await FamilyGroups.create(familygroupTest);
        expect(fg.groupName).toBe(familygroupTest.groupName);
        await FamilyGroups.findOneAndDelete({_id: fg._id});    
      });
});

//=====================================================================================//

describe("Add Member to Family Group", () => {
    test("Add a family Member", async () => {
        familygroupTest = {
          groupName: "test family group"
        };
        let newUser = new Users(defaultUser);
        console.log(newUser._id);


        const fg = await FamilyGroups.create(familygroupTest);
        FamilyGroups.updateOne({ _id: fg._id },
            {
                $addToSet: {
                    groupMembers: new mongoose.Types.ObjectId(),
                },
            });
        console.log(fg.groupMembers);
        //expect(fg.groupMembers).toBe(result);
        await FamilyGroups.findOneAndDelete({_id: fg._id});    
      });

      test("Add an empty family Member", async () => {
        familygroupTest = {
          groupName: "test family group"
        };

        let newUser = new Users(defaultUser);
        console.log(newUser._id);


        const fg = await FamilyGroups.create(familygroupTest);
        FamilyGroups.updateOne({ _id: fg._id },
            {
                $addToSet: {
                    groupMembers: new mongoose.Types.ObjectId(),
                },
            });
        console.log(fg.groupMembers);
        //expect(fg.groupMembers).toBe(result);
        await FamilyGroups.findOneAndDelete({_id: fg._id});    
      });
});