const app = require('../../app');
const FamilyGroups = require('../../models/familyGroupModel');
let supertest = require('supertest');
let request = supertest(app);
const mongoose = require('mongoose');
const mongodb = require('mongodb');
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//

let newFamilyGroup;

const defaultFamilyGroup = {
    groupName: "test family group"
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
    test("Successfully find and delete event", async () => {
        
        let newFamilyGroup = new FamilyGroups({groupName: "test family group"});

        await newFamilyGroup.save();

        const response = await request.post("/api/familyGroups/createFamilyGroup").send({
            groupName: "test family group"
        });
        expect(response.statusCode).toBe(200);
      });
});

//=====================================================================================//

describe("Add Member to Family Group", () => {
   //TO-DO
});