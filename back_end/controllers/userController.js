const Users = require("../models/userModel");
const errorToJSON = require('error-to-json');

function validatePassword(password) {

};

exports.registerUser = async(req, res) => {
  try {
    // TODO: needs logic and stuff
    let newUser = await Users.create(req.body);
    if (newUser === null) {
      throw err;
    } else {
      res.status(201).json({ // created successfully 
        status: "success",
        message: "New user created",
        data: {newUser}
      });
    }
  } catch (err) {
    res.status(400).json({ // bad request 
      status: "fail",
      message: err.message,
      description: "Failed to register a new user",
    });
  };
};

exports.getUser = async(req, res) => {
  try {
    const user = await Users.findOne({email: req.body.email});
    if (user == null) {
      throw err;
    }
    if (user.passwordHash === req.body.passwordHash) {
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
    const user = await Users.findOneAndUpdate({email: req.body.email},
      req.body, {new: true, runValidators: true}
    );
    if (user == null) {
      throw err;
    } else {
      return res.json({ // everything is OK
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

// TODO: password confirmation? 
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
