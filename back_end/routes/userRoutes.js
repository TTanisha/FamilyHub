const userController = require("../controllers/userController");
const express = require("express");
const router = express.Router();


// send each request to corresponding controller function

// for example: router.route("/createUser").post(userController.createUser);


module.exports = router;
