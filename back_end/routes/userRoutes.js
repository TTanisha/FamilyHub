const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/userController");

// send each request to corresponding controller function
router.route("/registerUser").post(userController.registerUser);
router.route("/getUserById").get(userController.getUserById);
router.route("/getUser").get(userController.getUser);
router.route("/getUser").post(userController.getUser);
router.route("/getUserById").post(userController.getUserById);
router.route("/updateUser").post(userController.updateUser);
router.route("/deleteUser").post(userController.deleteUser);

module.exports = router;
