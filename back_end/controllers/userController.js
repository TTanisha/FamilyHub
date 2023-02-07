const Users = require("../models/userModel");


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
      console.log(err)
        res.status(401).json({
            message: "User not successful created",
            error: err.mesage,
          })
    }
    
};
