const app = require('../../app');
const Users = require('../../models/userModel');
let supertest = require('supertest');
let request = supertest(app);
const mongoose = require('mongoose');
const { deleteOne } = require('../../models/userModel');
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//

const defaultUser = {
  email: "test@integration.com",
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

  Users.createIndexes();
  let newUser = new Users(defaultUser);
  await newUser.save();
});

//=====================================================================================//

afterAll(async () => {
  // make sure we have deleted the test users from the database
  try {
    await Users.findOneAndDelete({email: defaultUser.email});
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
      email: "testIntegration@gmail.com",
      password: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(201);
    await Users.findOneAndDelete({email: "testIntegration@gmail.com"});   
  });

  test("Register with a duplicate email", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: defaultUser.email,
      password: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);  
  });

  test("Register without a first name", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      password: "testPassword123",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);
  });

  test("Register without a password", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);  
  });

  test("Register with an invalid password", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      password: "bad", // must be at least six characters long
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);  
  });

  test("Register with an invalid first name", async () => {
    const response = await request.post("/api/users/registerUser").send({
      email: "testemail@gmail.com",
      password: "testPassword123",
      firstName: "", // must be at least one character long 
      lastName: "testLastName",
      birthday: new Date()
    }); 
    expect(response.statusCode).toBe(400);  
  });

  test("Register a new user with all fields", async () => {
    const response = await request.post("/api/users/registerUser").send({
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
      homeNumber: 5555555
    }); 
    expect(response.statusCode).toBe(201);
    await Users.findOneAndDelete({email: "testintegrationemail@test.com"});    
  });

}); 

//=====================================================================================//

describe("Get User Tests", () => {

  test("Find valid user by email and password", async () => {
    const response = await request.get("/api/users/getUser").send({
      email: defaultUser.email,
      password: defaultUser.password
    });
    expect(response.statusCode).toBe(200);
  });

  test("Valid email, invalid password", async () => {
    const response = await request.get("/api/users/getUser").send({
      email: defaultUser.email,
      password: "badPassword123"
    });
    expect(response.statusCode).toBe(400);
  });

  test("No such user", async () => {
    const response = await request.get("/api/users/getUser").send({
      email: "testemail@test.com",
      password: "testPassword123"
    });
    expect(response.statusCode).toBe(400);
  });

});

//=====================================================================================//

describe("Update User Tests", () => {

  test("Successfully update required user parameters", async () => {
    filter = {email: defaultUser.email};
    updateFields = {
      updateFirst: "newFirst"
    };
    const response = await request.post("/api/users/updateUser").send({
      filter: filter,
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(200);
  });

  test("Successfully update non-required user parameters", async () => {
    filter = {email: defaultUser.email};
    updateFields = {
      updateCell: 1237654,
      updateAddress: "new address, Winnipeg, MB, Canada",
    }
    const response = await request.post("/api/users/updateUser").send({
      filer: filter,
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(200);
  });

  test("Invalid update parameters", async () => {
    filter = {email: defaultUser.email};
    updateFields = {
      lastName: ""
    }
    const response = await request.post("/api/users/updateUser").send({
      filer: filter,
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(400);
  });

  test("Duplicate email update", async () => {
    const tempUser = await Users.create({
      email: "newIntegration@test.ca", 
      password: "password",
      firstName: "first", 
      lastName: "last", 
      birthday: new Date()
    });
    filter = {email: tempUser.email};
    updateFields = {
      email: defaultUser.email
    };
    const response = await request.post("/api/users/updateUser").send({
      filer: filter,
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(400);
    await Users.findByIdAndDelete(tempUser._id);
  });


  test("No such user", async () => {
    filter = {email: "bademail@test.com"};
    updateFields = {
      firstName: "name"
    }
    const response = await request.post("/api/users/updateUser").send({
      filter: filter,
      updateFields: updateFields
    });
    expect(response.statusCode).toBe(400);
  });

});

//=====================================================================================//

describe("Delete User Tests", () => {

  test("Successfully find and delete user", async () => {
    const testUser = await Users.create({
      email: "testIntegration@gmail.com",
      password: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    });
    const response = await request.post("/api/users/deleteUser").send({
      email: testUser.email
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
