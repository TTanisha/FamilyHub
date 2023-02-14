const { MongoServerError } = require("mongodb");
const Users = require("../models/userModel");

exports.registerUser = async(req, res) => {
  try {
    const newUser = await Users.create(req.body);
    if (newUser == null) {
      throw err;
    } else {
      res.status(201).json({ // created successfully 
        status: "success",
        message: "New user created",
        data: {newUser}
      });
    };
  } catch (err) {
    if (err instanceof MongoServerError) {
      res.status(409).json({ // bad request 
        status: "fail",
        message: err.message,
        description: "Failed to register a new user",
      });
    } else {
      res.status(400).json({ // bad request 
        status: "fail",
        message: err.message,
        description: "Failed to register a new user",
      });
    }
  };
};

exports.getUserById = async(req, res) => {
  try {
    const user = await Users.findById(req.body.id);
    if (user == null) {
      throw err;
    } else {
      res.status(200).json({ // everything is OK
        status: "success",
        message: "User found",
        data: {user}
      });
    };
  } catch (err) {
    res.status(400).json({ // bad request
      status: "fail",
      message: err.message,
      description: "Failed to get the user"
    });
  };
};

exports.getUser = async(req, res) => {
  try {
    const user = await Users.find({email: req.body.email});
    if (user == null) {
      throw err;
    }
    if (user.password === req.body.password) {
      res.status(200).json({ // everything is OK
        status: "success",
        message: "User found",
        data: {user}
      });
    } else {
      throw err;
    }
  } catch (err) {
    res.status(400).json({ // bad request
      status: "fail",
      message: err.message,
      description: "Failed to get the user"
    });
  };
};

exports.updateUser = async(req, res) => {
  try {
    // find user by email
    // update user with req and run validation on the update parameters
    // return the updated user
    if (req.body.updateFields.email != null) { // check for duplicates first
      const checkDuplicate = await Users.find(req.body.updateFields.email);
      if (checkDuplicate == null || checkDuplicate.length != 0) { // email already exists
        throw err;
      } 
    }  // either not updating email, or email is unique
    const user = await Users.findOneAndUpdate(req.body.filter, req.body.updateFields,
      {new: true, runValidators: true}
    );
    if (user == null) {
      throw err;
    } else {
      res.json({ // everything is OK
        code: 200,
        status: "success",
        message: "User updated",
        data: {user}
      });
    }
  } catch (err) {
    res.status(400).json({ // bad request
      status: "fail",
      message: err.message,
      description: "Failed to update the user"
    });
  }
};

exports.deleteUser = async(req, res) => {
  try {
    const user = await Users.findOneAndDelete({email: req.body.email});
    if (user == null) {
      throw err;
    } else {
      res.status(200).json({ // everything is OK
        status: "success",
        message: "User deleted",
        data: {user}
      });
    }
  } catch (err) {
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to delete the user",
    });
  };
};
