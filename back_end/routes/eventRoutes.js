const express = require("express");
const router = express.Router();

// Controllers
const eventController = require("../controllers/eventController");

// send each request to corresponding controller function
router.route("/createEvent").post(eventController.createEvent);
router.route("/getEvent").get(eventController.getEvent);
router.route("/updateEventName").post(eventController.updateEventName);
router.route("/updateEventBody").post(eventController.updateEventBody);
router.route("/updateEventTime").post(eventController.updateEventTime);
router.route("/updateEventLocation").post(eventController.updateEventLocation);
router.route("/updateEventTags").post(eventController.updateEventTags);
router.route("/updateEventGroup").post(eventController.updateEventGroup);
router.route("/deleteEvent").post(eventController.deleteEvent);

module.exports = router;
