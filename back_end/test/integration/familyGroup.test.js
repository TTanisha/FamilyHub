const app = require('../../app');
const FamilyGroups = require('../../models/familyGroupModel');
const Users = require("../../models/userModel");

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

const defaultUser = {
  email: "testFamilyGroup@model.com",
  password: "testPassword123",
  firstName: "testFirstName",
  lastName: "testLastName",
  birthday: new Date()
};

  beforeAll(async () => {
    // Database connection
    const DB = process.env.TEST_DB;
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
    
    if ( null == await Users.findOne({email: defaultUser.email})){
      Users.create(defaultUser);
    }
  
  });
  
  //=====================================================================================//
  
  afterAll(async () => {
    // make sure we have deleted the test FamilyGroups from the database
    try {
      await FamilyGroups.findByIdAndDelete(newFamilyGroup._id);
      await Users.findOneAndDelete({email: defaultUser.email});    
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
  test("Successfully Create a Family Group", async () => {
    const response = await request.post("/api/familyGroups/createFamilyGroup").send({
        groupName: "test family group"
    });
    createdGroupID = response._body.group._id;
    expect(response.statusCode).toBe(200);
    await FamilyGroups.findOneAndDelete({_id: createdGroupID}); 

  });
});

//=====================================================================================//

describe("Add group member to Family Group", () => {
  test("Successfully add a family member to a group.", async () => {
   
    const response = await request.post("/api/familyGroups/addMemberToFamilyGroup").send({
      groupId: newFamilyGroup._id, 
      memberEmail: defaultUser.email
    });
    expect(response.statusCode).toBe(200);
  });
});


//=====================================================================================//

describe("Remove member from Family Group", () => {

  test("Successfully remove a family member from a group.", async () => {
  
    // First add a member
    let response = await request.post("/api/familyGroups/addMemberToFamilyGroup").send({
      groupId: newFamilyGroup._id, 
      memberEmail: defaultUser.email
    });
    expect(response.statusCode).toBe(200);

    //Now remove that member
    let newUser = await Users.findOne({email: defaultUser.email});
    response = await request.post("/api/familyGroups/leaveFamilyGroup").send({
      groupId: newFamilyGroup._id, 
      memberId: newUser._id
    });

    expect(response.statusCode).toBe(200);
  });
});
