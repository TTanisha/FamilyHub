const Users = require("../models/userModel");
const errorToJSON = require('error-to-json');
const { db } = require("../models/userModel");

// Include controller logic

/* 
exports.registerUser = async(req, res, next) => { 
    try {
      const { username, password, firstName, lastName, birthday, eMail } = req.body
      if (password.length < 6) {
          return res.status(400).json({ message: "Password less than 6 characters" })
      }
          await Users.create({
            username,
            password,
            firstName, 
            lastName,
            birthday, 
            eMail
          }).then(user =>
            res.status(200).json({
              status: "success",
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
        if (dbError.keyValue.username != undefined){

          reason =  "The user name: " + dbError.keyValue.username + " already exists. "
        } else if (dbError.keyValue.eMail != undefined){
         
          reason =  "The email: " + dbError.keyValue.eMail + " is already in use. "
        }
      }

      res.status(401).json({
          message: reason + "User not successful created",
        })
    }
    
};


exports.getUser = async(req, res) => {
  try {
    
    const { username, password } = req.body
    const user = await Users.findOne({ username: username });
    reason = "";

    if (user == null) {
      reason = "User not found";
      throw err;
    }

    if (user.password === password) {
        res.status(200).json({
            status: "success",
            message: "Found user",
            data: {
                user: user,
            },
        });
        return;

    } else {
      reason = "Invalid Password";
      throw err;
    }
  } catch (err) {

    res.status(404).json({
        status: "fail",
        message: "Unsuccessful Login. " + reason,
    });
  }
}; */
