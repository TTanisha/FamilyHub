const express = require("express");
const router = express.Router();

// Controllers
const eventController = require("../controllers/eventController");

// send each request to corresponding controller function
router.route("/createEvent").post(eventController.createEvent);
router.route("/getEventById").get(eventController.getEventById);
router.route("/getEvents").get(eventController.getEvents);
router.route("/updateEvent").post(eventController.updateEvent);
router.route("/updateRecurrence").post(eventController.updateRecurrence);
router.route("/deleteEvent").post(eventController.deleteEvent);
router.route("/deleteRecurrence").post(eventController.deleteRecurrence);

module.exports = router;
