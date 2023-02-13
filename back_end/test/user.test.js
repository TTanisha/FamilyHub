const app = require('../app');
const Users = require('../models/userModel');
let supertest = require('supertest');
let request = supertest(app);
const mongoose = require('mongoose');
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//

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

  userData = {
    email: "testemail@gmail.com",
    passwordHash: "testPassword123",
    firstName: "testFirstName",
    lastName: "testLastName",
    birthday: new Date()
  }
  let newUser = new Users(userData);
  await newUser.save();
});

//=====================================================================================//

afterAll(async () => {
  // make sure we have deleted the test users from the database
  try {
    await Users.findOneAndDelete({email: "testemail@gmail.com"});
  } catch (err) {
    console.log("User not found.");
  }
  await mongoose.connection.close().then(
    () => {console.log("Successfully disconnected from MongoDB.")},
    err => {console.error("Unable to disconnect from MongoDB.", err.message)}
  );
});

//=====================================================================================//

describe("User Registration Tests", () => {

  test("Register a new user", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@test.com",
      passwordHash: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(201);
    await Users.findOneAndDelete({email: "testemail@test.com"});    
  });

  test("Register with a duplicate email", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      passwordHash: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);  
  });

  test("Register without a first name", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      passwordHash: "testPassword123",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);
  });

  test("Try to register without a password", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);  
  });

  // TODO
  test("Register with an invalid password", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      passwordHash: "bad",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);  
  });

  test("Register with an invalid first name", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      passwordHash: "testPassword123",
      firstName: "",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);  
  });

  test("Register a new user with all fields", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@test.com",
      passwordHash: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date(),
      nickname: "name",
      pronouns: "she/her",
      displayEmail: "testemail@gmail.com",
      address: "111 test street, Winnipeg, MB, Canada",
      cellNumber: 1234567,
      homeNumber: 5555555
    }); 
    expect(response.statusCode).toBe(201);
    await Users.findOneAndDelete({email: "testemail@test.com"});    
  });

}); 

//=====================================================================================//

describe("Get User Tests", () => {

  test("Find valid user by email and password", async () => {
    const response = await request.get("/api/users/getUser").send({
      email: "testemail@gmail.com",
      passwordHash: "testPassword123",
    });
    expect(response.statusCode).toBe(200);
  });

  test("Valid email, invalid password", async () => {
    const response = await request.get("/api/users/getUser").send({
      email: "testemail@gmail.com",
      passwordHash: "badPassword123",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Similar email, different user", async () => {
    const response = await request.get("/api/users/getUser").send({
      email: "testemail2@gmail.com",
      passwordHash: "testPassword123",
    });
    expect(response.statusCode).toBe(400);
  });

  test("No such user", async () => {
    const response = await request.get("/api/users/getUser").send({
      email: "testemail@test.com",
      passwordHash: "testPassword123"
    });
    expect(response.statusCode).toBe(400);
  });

});

//=====================================================================================//

describe("Update User Tests", () => {

  test("Successfully update required user parameters", async () => {
    updateFirst = "newFirst";
    const response = await request.post("/api/users/updateUser").send({
      email: "testemail@gmail.com",
      firstName: updateFirst
    });
    expect(response.statusCode).toBe(200);
    //TODO:
    //expect(response.body.firstName).toBe(updateFirst);
  });

  test("Successfully update non-required user parameters", async () => {
    updateCell = 1237654;
    updateAddress = "new address, Winnipeg, MB, Canada";
    const response = await request.post("/api/users/updateUser").send({
      email: "testemail@gmail.com",
      cellNumber: updateCell,
      address: updateAddress
    });
    expect(response.statusCode).toBe(200);
    // TODO:
    //expect(response.body.cellNumber).toBe(updateCell);
    //expect(response.body.address).toBe(updateAddress);
  });

  test("Invalid update parameters", async () => {
    updateParams = {
      lastName: ""
    }
    const response = await request.post("/api/users/updateUser").send({
      updateParams
    });
    expect(response.statusCode).toBe(400);
  });

  test("Duplicate email update", async () => {
    updateParams = {
      email: "testemail@gmail.com"
    }
    const response = await request.post("/api/users/updateUser").send({
      updateParams
    });
    expect(response.statusCode).toBe(400);
  });


  test("No such user", async () => {
    const response = await request.post("/api/users/updateUser").send({
      email: "bademail@test.com"
    });
    expect(response.statusCode).toBe(400);
  });

});

//=====================================================================================//

describe("Delete User Tests", () => {

  test("Successfully find and delete user", async () => {
    userData = {
      email: "test@test.ca",
      passwordHash: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }
    let newUser = new Users(userData);
    await newUser.save();
    const response = await request.post("/api/users/deleteUser").send({
      email: "test@test.ca",
      passwordHash: "testPassword123"
    });
    expect(response.statusCode).toBe(200);
  });

  test("No such user", async () => {
    const response = await request.post("/api/users/deleteUser").send({
      email: "bademail@test.com"
    });
    expect(response.statusCode).toBe(400);
  });

});
