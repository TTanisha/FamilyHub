const Users = require("../models/userModel");
const errorToJSON = require('error-to-json');
const { db } = require("../models/userModel");

// Include controller logic

exports.registerUser = async(req, res, next) => { 
    
    const { username, password, firstName, lastName, birthday, eMail } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }

    // TO DO: further input validation

    try {
          await Users.create({
            username,
            password,
            firstName, 
            lastName,
            birthday, 
            eMail
          }).then(user =>
            res.status(200).json({
              message: "User successfully created",
              user,
            })
          )
    } catch (err) {
      //parsing error to JSON
      var reason = "";
      var dbError = errorToJSON.parse(err);
      console.log("The following error occured:" + dbError);
      
      if (dbError.code == 11000) {    //duplicate key error
        reason =  dbError.keyValue.username + " already exists. "
      }


      res.status(401).json({
          message: reason + "User not successful created",
        })
    }
    
};
