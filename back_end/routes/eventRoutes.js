const express = require("express");
const router = express.Router();

// Controllers
const eventController = require("../controllers/eventController");

// send each request to corresponding controller function
router.route("/createEvent").post(eventController.createEvent);
router.route("/getEventById").get(eventController.getEventById);
router.route("/getEvents").get(eventController.getEvents);
router.route("/updateEvent").post(eventController.updateEvent);
router.route("/deleteEvent").post(eventController.deleteEvent);

module.exports = router;
