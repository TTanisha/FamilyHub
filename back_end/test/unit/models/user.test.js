const Users = require('../../../models/userModel');
const mongoose = require('mongoose');
const { ValidationError } = require('mongodb')
require("dotenv").config({path: "config.env"}); // load environment variables

//=====================================================================================//

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
    userData = {
      email: "testunit@gmail.com",
      password: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    };
    const user = await Users.create(userData);
    expect(user.email).toBe(userData.email);
    await Users.findOneAndDelete({email: userData.email});    
  });

  test("Register with a duplicate email", async () => {
    userData = {
      email: defaultUser.email,
      password: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    };
    const user = Users.create(userData);
    await expect(user).rejects.toThrow();
  });

  test("Register without a first name", async () => {
    userData = {
      email: "testemail@gmail.com",
      password: "testPassword123",
      lastName: "testLastName",
      birthday: new Date()
    };
    const user = Users.create(userData);
    await expect(user).rejects.toThrow(ValidationError);
  });

  test("Register without a password", async () => {
    userData = {
      email: "testemail@gmail.com",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    };
    const user = Users.create(userData);
    await expect(user).rejects.toThrow(ValidationError);
  });

  test("Register with an invalid password", async () => {
    userData = {
      email: "testemail@gmail.com",
      password: "bad", // must be at least six characters long
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    };
    const user = Users.create(userData);
    await expect(user).rejects.toThrow(ValidationError);
  });

  test("Register with an invalid first name", async () => {
    userData = {
      email: "testemail@gmail.com",
      password: "testPassword123",
      firstName: "", // must be at least one character long 
      lastName: "testLastName",
      birthday: new Date()
    };
    const user = Users.create(userData);
    await expect(user).rejects.toThrow(ValidationError);
  });

  test("Register a new user with all fields", async () => {
    userData = {
      email: "testemail@gmail.com",
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
    };
    const user = await Users.create(userData);
    expect(user.email).toBe(userData.email);
    await Users.findOneAndDelete({email: userData.email});    
  });

}); 

//=====================================================================================//

describe("Get User Tests", () => {

  test("Find valid user by email and password", async () => {
    const user = await Users.findOne({email: defaultUser.email, 
      password: defaultUser.password});
    expect(user.email).toBe(defaultUser.email);
    expect(user.password).toBe(defaultUser.password);
  });

  test("Valid email, invalid password", async () => {
    userData = {
      email: defaultUser.email,
      password: "badPassword123"
    };
    const user = await Users.findOne(userData);
    expect(user).toBe(null);
  });

  test("No such user", async () => {
    userData = {
      email: "testemail@test.com",
      password: "testPassword123"
    };
    const user = await Users.findOne(userData);
    expect(user).toBe(null);
  });

});

//=====================================================================================//

describe("Update User Tests", () => {

  test("Successfully update required user parameters", async () => {
    filter = {email: defaultUser.email};
    updateFields = {
      firstName: "newFirst"
    };
    const user = await Users.findOneAndUpdate(filter, updateFields, {new: true});
    expect(user.email).toBe(filter.email);
    expect(user.firstName).toBe(updateFields.firstName);
  });

  test("Successfully update non-required user parameters", async () => {
    filter = {email: defaultUser.email};
    updateFields = {
      cellNumber: 1237654, 
      address: "new address, Winnipeg, MB, Canada"
    };
    const user = await Users.findOneAndUpdate(filter, updateFields, {new: true});
    expect(user.email).toBe(filter.email);
    expect(user.cellNumber).toBe(updateFields.cellNumber);
    expect(user.address).toBe(updateFields.address);
  });

  test("Invalid update parameters", async () => {
    filter = {email: defaultUser.email};
    updateFields = {
      lastName: ""
    };
    const user = await Users.findOneAndUpdate(filter, updateFields);
    expect(user.email).toBe(filter.email);
    expect(user.lastName).toBe(defaultUser.lastName);
  });

  test("Duplicate email update", async () => {
    const tempUser = await Users.create({
      email: "newUnit@test.ca", 
      password: "password",
      firstName: "first", 
      lastName: "last", 
      birthday: new Date()
    });
    filter = {email: tempUser.email};
    updateFields = {
      email: defaultUser.email
    };
    const user = Users.findOneAndUpdate(filter, updateFields, 
      {new: true, runValidators: true});
    await expect(user).rejects.toThrow();
    await Users.findByIdAndDelete(tempUser._id);
  });

  test("No such user", async () => {
    filter = {email: "bademail@test.com"};
    updateFields = {
      password: "newPassword"
    };
    const user = await Users.findOneAndUpdate(filter, updateFields, {new: true});
    expect(user).toBe(null);
  });

});

//=====================================================================================//

describe("Delete User Tests", () => {

  test("Successfully find and delete user", async () => {
    userData = {
      email: "testUnit@gmail.com",
      password: "testPassword123",
      firstName: "testFirstName",
      lastName: "testLastName",
      birthday: new Date()
    }
    const user = await Users.create(userData);
    const deletedUser = await Users.findOneAndDelete({email: userData.email});
    expect(deletedUser.email).toBe(userData.email);
    expect(deletedUser.password).toBe(user.password);
    check = await Users.find({email: user.email});
    expect(check.length).toBe(0);
  });

  test("No such user", async () => {
    const user = await Users.findOneAndDelete({email: "bademail@test.com"});
    expect(user).toBe(null);
  });

});
